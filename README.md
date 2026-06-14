# TOEFLin Undova - Platform Simulasi TOEFL ITP Resmi Universitas Cordova

TOEFLin adalah sebuah aplikasi simulasi ujian TOEFL ITP yang dirancang khusus untuk memberikan pengalaman ujian yang realistis, komprehensif, dan mudah diakses bagi mahasiswa Universitas Cordova.

## 🚀 Fitur Utama

- **Simulasi Ujian Realistis**: Dilengkapi dengan format dan durasi waktu yang sama persis dengan ujian TOEFL ITP asli (Listening, Structure & Written Expression, dan Reading Comprehension).
- **Auto-Scoring & Analisis**: Nilai ujian otomatis dikonversi menggunakan skala ITP resmi (310–677). Pengguna juga mendapatkan analisis detail terkait area kelemahan dan kekuatan mereka.
- **Sertifikat PDF Premium**: Peserta yang telah menyelesaikan ujian dapat mengunduh hasil (sertifikat) dalam format PDF berdesain elegan.
- **Manajemen Bank Soal & Paket Tes**: Akses panel admin untuk mengelola ribuan soal dan merakit paket soal sesuai tingkat kesulitan.
- **Sistem Pembatasan Ujian Mingguan**: Ujian penuh hanya dapat diambil 1 kali dalam seminggu untuk mendorong belajar mandiri. Mahasiswa dapat meminta akses tambahan (Request) jika diperlukan, yang dapat disetujui melalui Dashboard Admin.

## 🛠️ Teknologi yang Digunakan

Aplikasi ini menggunakan teknologi *stack* modern:

### Frontend
- **Framework**: Next.js 14/15 (App Router)
- **Styling**: TailwindCSS v4
- **Icons**: Lucide React
- **PDF Generation**: jspdf & html2canvas

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL / MySQL (via TypeORM)
- **Validation**: class-validator & class-transformer

## 📋 Alur Aplikasi (User Flow)

### 1. Alur Mahasiswa (Student)
1. **Landing Page**: Pengguna melihat informasi simulasi dan tombol akses masuk.
2. **Login/Register**: Autentikasi mahasiswa (menggunakan NIM atau Email).
3. **Dashboard Mahasiswa**: Menampilkan riwayat ujian, skor tertinggi, dan paket ujian yang tersedia.
4. **Persiapan Ujian**: Verifikasi audio (tes suara) dan instruksi ujian sebelum menekan tombol "Mulai Ujian". 
   - *Catatan:* Jika batas 1x seminggu tercapai, pengguna tidak bisa memulai ujian dan dapat menekan tombol "Request Kesempatan" untuk mengajukan izin khusus ke Admin.
5. **Ujian Berlangsung**: Menjawab soal dengan *timer* sesuai sesi. Ujian dibagi 3 seksi: Listening, Structure, dan Reading.
6. **Hasil & Sertifikat**: Setelah selesai (atau waktu habis), sistem langsung menampilkan skor (310-677) dan mengaktifkan opsi unduh sertifikat PDF.

### 2. Alur Administrator (Admin)
1. **Login Admin**: Akses menggunakan kredensial khusus melalui `/admin/login`.
2. **Dashboard Overview**: Ringkasan jumlah mahasiswa, total soal, ujian aktif, dan permohonan tertunda.
3. **Bank Soal**: CRUD (Buat, Baca, Ubah, Hapus) soal ujian lengkap dengan audio untuk sesi *Listening*.
4. **Paket Tes**: Merakit paket dari Bank Soal untuk diakses oleh mahasiswa.
5. **Permohonan Ujian (Requests)**: Admin dapat meninjau, menyetujui, atau menolak permintaan izin ujian khusus dari mahasiswa yang sudah melebihi batas percobaan mingguan.

## 💻 Cara Menjalankan Aplikasi di Lokal

Pastikan Anda memiliki Node.js dan Database (MySQL/PostgreSQL) yang sudah ter-install di sistem Anda.

1. **Clone repository ini:**
   ```bash
   git clone https://github.com/celcious-cyber/toeflin.git
   cd toeflin
   ```

2. **Jalankan Backend (NestJS):**
   ```bash
   cd backend
   npm install
   # Konfigurasi file .env Anda sesuai dengan kredensial database
   npm run start:dev
   ```

3. **Jalankan Frontend (Next.js):**
   ```bash
   cd ../frontend
   npm install
   # Konfigurasi file .env.local jika diperlukan
   npm run dev
   ```

4. Buka `http://localhost:3000` di peramban Anda untuk melihat aplikasi beraksi.

---
Dikembangkan untuk Universitas Cordova. Hak Cipta Dilindungi Undang-Undang.
