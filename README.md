# Puncak Gear - Aplikasi Penyewaan Perlengkapan Outdoor

Aplikasi web ini memungkinkan pengguna untuk melihat dan menyewa perlengkapan outdoor seperti tas, tenda, alat masak, dan lainnya. Data produk diambil dari Google Sheets, sehingga mudah untuk dikelola dan diperbarui.

## Fitur Utama

*   **Tampilan Produk:** Menampilkan daftar produk dengan gambar, nama, harga, dan status ketersediaan.
*   **Filter Kategori:** Memungkinkan pengguna untuk memfilter produk berdasarkan kategori (tas, tenda, masak, sepatu, pakaian).
*   **Pencarian Cerdas:** Pencarian produk dengan dukungan sinonim dan koreksi typo.
*   **Keranjang Belanja:** Menambahkan produk ke keranjang belanja dan mengelola jumlahnya.
*   **Formulir Pemesanan:** Mengisi formulir pemesanan dengan detail penyewa dan tanggal sewa.
*   **Integrasi WhatsApp:** Mengirim detail pemesanan ke admin melalui WhatsApp.
*   **Detail Produk:** Menampilkan detail lengkap produk dalam modal.
*   **Syarat & Ketentuan:** Menampilkan syarat dan ketentuan penyewaan.
*   **Responsif:** Tampilan yang optimal di berbagai perangkat.

## Struktur Data Google Sheets

Berikut adalah contoh struktur data yang diharapkan di Google Sheets:

| id  | name                 | category | normalPrice | price | image                                                                 | bahan | kapasitas | berat | available |
| --- | -------------------- | -------- | ----------- | ----- | --------------------------------------------------------------------- | ----- | --------- | ----- | --------- |
| 1   | Tas Carrier Consina  | tas      | 60000       | 50000 | images/tas-consina.jpg                                                | Cordura | 50L       | 1.5kg | true      |
| 2   | Tenda Dome Greatout | tenda    | 80000       | 75000 | images/tenda-greatout.jpg                                             | Nylon   | 4 orang    | 2.5kg | true      |
| 3   | Kompor Camping       | masak    | 30000       | 25000 | images/kompor-camping.jpg                                             | Besi    | -         | 0.5kg | true      |
| 4   | Sepatu Hiking        | sepatu   | 120000      | 100000| images/sepatu-hiking.jpg                                              | Kulit  | 42        | 0.8kg | false     |
| ... | ...                  | ...      | ...         | ...   | ...                                                                     | ...   | ...       | ...   | ...       |

*   **id:** ID unik produk (angka).
*   **name:** Nama produk (teks).
*   **category:** Kategori produk (tas, tenda, masak, sepatu, pakaian).
*   **normalPrice:** Harga normal sebelum diskon (angka).
*   **price:** Harga sewa per hari setelah diskon (angka, opsional).
*   **image:** URL gambar produk (teks).
*   **bahan:** Bahan produk (teks).
*   **kapasitas:** Kapasitas produk (teks).
*   **berat:** Berat produk (teks).
*   **available:** Status ketersediaan produk (true/false).

## Lisensi

Aplikasi web ini dilisensikan di bawah [Lisensi MIT](#license).

## Kontribusi

Kontribusi dipersilakan! Jika Anda menemukan bug atau memiliki saran fitur, silakan buat issue atau pull request.

## Demo

[Tautan ke Demo Aplikasi](https://puncakgear.github.io)

## Kontak

Jika Anda memiliki pertanyaan atau masalah, silakan hubungi [email protected]