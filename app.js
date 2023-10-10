const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

app.get('/cekporsihaji', async (req, res) => {
  try {
    let data = new FormData();
    data.append('nomor_porsi', req.query.nomor_porsi);

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://haji.kemenag.go.id/sieis/Estimasi/getEstimasi/',
      headers: {
        ...data.getHeaders(),
      },
      data: data,
    };

    const response = await axios.request(config);

    // Load konten HTML menggunakan Cheerio
    const $ = cheerio.load(response.data);

    // Temukan elemen HTML yang berisi "Nama Jamaah"
    const namaJamaahElement = $('label:contains("Nama Jamaah")');
    const namaAyahlement = $('label:contains("Nama Ayah")');
    const genderlement = $('label:contains("Jenis Kelamin")');
    const tanggalDaftarelement = $('label:contains("Tgl. Pendaftaran")');
    const statusHajielement = $('label:contains("Status Haji")');
    const tglLahirelement = $('label:contains("Tgl. Lahir")');
    const umurelement = $('label:contains("Umur")');
    const TelahMenunngguelement = $('label:contains("Telah Menunnggu")');
    const EstimasiBerangkatelement = $('label:contains("Estimasi Berangkat")');
    const SisaMenungguelement = $('label:contains("Sisa Menunggu")');
    const MasaMenungguelement = $('label:contains("Masa Menunggu")');
    const Propinsielement = $('label:contains("Propinsi")');
    const Urutanelement = $('label:contains("Urutan Ke")');
    const KuotaPropinsielement = $('label:contains("Kuota Propinsi")');
    const Kabupatenelement = $('label:contains("Kabupaten")');


    // Dapatkan teks di dalam elemen tersebut
    const namaJamaah = namaJamaahElement.next().text();
    const namaAyah = namaAyahlement.next().text();
    const gender = genderlement.next().text();
    const tanggalDaftar = tanggalDaftarelement.next().text();
    const statusHaji = statusHajielement.next().text();
    const tglLahir = tglLahirelement.next().text();
    const umur = umurelement.next().text();
    const telahMenunnggu = TelahMenunngguelement.next().text();
    const estimasiBerangkat = EstimasiBerangkatelement.next().text();
    const sisaMenunggu = SisaMenungguelement.next().text();
    const masaMenunggu = MasaMenungguelement.next().text();
    var Propinsi = Propinsielement.next().text();
    const UrutanKe = Urutanelement.next().text();
    const KuotaPropinsi = KuotaPropinsielement.next().text();
    const Kabupaten = Kabupatenelement.next().text();
    Propinsi = Propinsi.replace(KuotaPropinsi,'')
    
    res.json({ 
        namaJamaah, namaAyah, gender, tanggalDaftar, statusHaji, tglLahir, umur,
        telahMenunnggu, estimasiBerangkat, sisaMenunggu, masaMenunggu, 
        Propinsi, UrutanKe, KuotaPropinsi , Kabupaten
    });
  } catch (error) {
    console.error('Terjadi kesalahan saat scraping:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat scraping' });
  }
});

app.get('/harga-emas', (req, res) => {
  const url = 'https://www.indogold.id/harga-emas-hari-ini';
  axios.get(url)
    .then((response) => {
      const $ = cheerio.load(response.data);

      const data = {
        ubs: [],
        antam: [],
        lotusarchi: [],
      };

      // Menggunakan selektor untuk mengambil data yang diinginkan
      $('#tab0 tr:not(#final)').each((index, element) => {
        const kepingan = $(element).find('td').eq(0).text().trim();
        const hargaBeli = $(element).find('td').eq(1).text().trim();
        const hargaJual = $(element).find('td').eq(2).text().trim();
        if(kepingan != ""){
          data.ubs.push({
            kepingan,
            hargaBeli,
            hargaJual,
          });
        }
      });

      $('#tab3 tr:not(#final)').each((index, element) => {
        const kepingan = $(element).find('td').eq(0).text().trim();
        const hargaBeli = $(element).find('td').eq(1).text().trim();
        const hargaJual = $(element).find('td').eq(2).text().trim();
        if(kepingan != ""){
          data.antam.push({
            kepingan,
            hargaBeli,
            hargaJual,
          });
        }
      });

      $('#tab2 tr:not(#final)').each((index, element) => {
        const kepingan = $(element).find('td').eq(0).text().trim();
        const hargaBeli = $(element).find('td').eq(1).text().trim();
        const hargaJual = $(element).find('td').eq(2).text().trim();
        if(kepingan != ""){
          data.lotusarchi.push({
            kepingan,
            hargaBeli,
            hargaJual,
          });
        }
      });

      // Mengambil data terakhir (Last Update)
      const lastUpdate = $('#tab3 #final td').text().trim();

      data.lastUpdate = lastUpdate;

      res.json(data);
    })
    .catch((error) => {
      console.error('Terjadi kesalahan:', error);
      res.status(500).json({ error: 'Terjadi kesalahan dalam pengambilan data.' });
    });
});

app.listen(port, () => {
  console.log(`Server berjalan pada http://localhost:${port}`);
});
