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

## Cara Penggunaan

1.  **Konfigurasi Google Sheets**
    *   Buka Google Sheets dan buat spreadsheet yang berisi data produk Anda.
    *   Pastikan spreadsheet memiliki header berikut: `id`, `name`, `category`, `price`, `normalPrice`, `image`, `bahan`, `kapasitas`, `berat`, `available`.
    *   Isi data produk sesuai dengan header tersebut.
    *   Publikasikan spreadsheet ke web dengan format CSV:
        *   Klik `File` > `Publish to the web`.
        *   Pilih tab `Link`.
        *   Pilih `Comma-separated values (.csv)` di dropdown.
        *   Klik `Publish`.
        *   Salin URL CSV yang dihasilkan.

2.  **Konfigurasi Aplikasi Web**
    *   Buka file `style.js`.
    *   Ganti nilai `SHEET_URL` dengan URL CSV yang telah Anda salin dari Google Sheets.

    ```javascript
    const SHEET_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTqt3F8pzIuenmvVYXZjEPxMQjqdO9Eshsz6Is5gRtJ17W7MY0vZcJlTzCrC_-t3uSFp908xchdOQJg/pub?gid=0&single=true&output=csv';
    ```

3.  **Konfigurasi Nomor WhatsApp Admin**
    *   Buka file `style.js`.
    *   Ganti nilai `targetPhoneNumber` dengan nomor WhatsApp admin Anda (format internasional tanpa '+').

    ```javascript
    const targetPhoneNumber = "6281927149299";
    ```

4.  **Membuka Aplikasi Web**
    *   Pastikan semua file HTML, CSS, dan JavaScript berada dalam satu folder.
    *   Buka file `index.html` di browser Anda.

## Struktur Data Google Sheets

Berikut adalah contoh struktur data yang diharapkan di Google Sheets:

| id  | name                 | category | price | normalPrice | image                                                                 | bahan | kapasitas | berat | available |
| --- | -------------------- | -------- | ----- | ----------- | --------------------------------------------------------------------- | ----- | --------- | ----- | --------- |
| 1   | Tas Carrier Consina  | tas      | 50000 | 60000       | images/tas-consina.jpg                                                | Cordura | 50L       | 1.5kg | true      |
| 2   | Tenda Dome Greatout | tenda    | 75000 | 80000       | images/tenda-greatout.jpg                                             | Nylon   | 4 orang    | 2.5kg | true      |
| 3   | Kompor Camping       | masak    | 25000 | 30000       | images/kompor-camping.jpg                                             | Besi    | -         | 0.5kg | true      |
| 4   | Sepatu Hiking        | sepatu   | 100000| 120000      | images/sepatu-hiking.jpg                                              | Kulit  | 42        | 0.8kg | false     |
| ... | ...                  | ...      | ...   | ...         | ...                                                                     | ...   | ...       | ...   | ...       |

*   **id:** ID unik produk (angka).
*   **name:** Nama produk (teks).
*   **category:** Kategori produk (tas, tenda, masak, sepatu, pakaian).
*   **price:** Harga sewa per hari (angka).
*   **normalPrice:** Harga normal sebelum diskon (angka).
*   **image:** URL gambar produk (teks).
*   **bahan:** Bahan produk (teks).
*   **kapasitas:** Kapasitas produk (teks).
*   **berat:** Berat produk (teks).
*   **available:** Status ketersediaan produk (true/false).

## Kustomisasi

Anda dapat menyesuaikan tampilan dan fungsionalitas aplikasi web ini dengan mengubah file HTML, CSS, dan JavaScript.

*   **HTML:** Struktur halaman web (file `index.html`).
*   **CSS:** Tampilan halaman web (file `style.css`).
*   **JavaScript:** Logika aplikasi web (file `style.js`).

## Catatan

*   Pastikan URL CSV Google Sheets dapat diakses publik.
*   Aplikasi web ini menggunakan Local Storage untuk menyimpan data keranjang belanja.
*   Pastikan browser Anda mendukung JavaScript.

## Lisensi

Aplikasi web ini dilisensikan di bawah [Lisensi MIT](LICENSE).

## Kontribusi

Kontribusi dipersilakan! Jika Anda menemukan bug atau memiliki saran fitur, silakan buat issue atau pull request.

## Demo

[Tautan ke Demo Aplikasi](https://puncakgear.github.io)

## Kontak

Jika Anda memiliki pertanyaan atau masalah, silakan hubungi [email protected]