# Product Requirements Document (PRD)
## Aplikasi CBT Simulasi TOEFL ITP - Universitas Cordova

| | |
|---|---|
| **Versi Dokumen** | 1.0 |
| **Tanggal** | 13 Juni 2026 |
| **Status** | Draft |
| **Pemilik Produk** | Universitas Cordova |

---

## 1. Latar Belakang & Tujuan

Universitas Cordova membutuhkan aplikasi Computer Based Test (CBT) berbasis web (PWA) yang memungkinkan mahasiswa melakukan simulasi TOEFL ITP secara mandiri (self-practice). Aplikasi ini mensimulasikan format TOEFL ITP (Paper-Based) dengan 3 section utama: **Listening Comprehension**, **Structure and Written Expression**, dan **Reading Comprehension**.

### Catatan Branding
Karena aplikasi ini masih dalam status **belum resmi**, desain UI/UX **tidak menggunakan identitas visual Universitas Cordova** (logo, warna institusi, dll). Branding menggunakan desain generik/netral (nama produk sementara, palet warna independen) yang dapat diganti di kemudian hari setelah aplikasi resmi diadopsi.

### Tujuan Produk
- Memberikan platform latihan TOEFL ITP yang realistis (format soal, waktu pengerjaan, dan suasana ujian).
- Memberikan estimasi skor TOEFL (skala 310-677) secara otomatis.
- Membantu mahasiswa mengetahui kelemahan per skill melalui analisis hasil.
- Memudahkan admin/dosen mengelola bank soal secara fleksibel (manual maupun massal).

---

## 2. Target Pengguna

| Peran | Deskripsi |
|---|---|
| **Mahasiswa** | Pengguna utama, melakukan simulasi tes secara mandiri (self-practice), melihat skor & riwayat progress |
| **Admin/Operator** | Mengelola bank soal, paket tes, audio listening, dan memonitor data agregat (jika dibutuhkan ke depannya) |

> Catatan: Fokus utama rilis pertama adalah **mahasiswa (self-practice)**. Peran admin dibutuhkan untuk pengelolaan konten soal, namun tanpa fitur manajemen kelas/laporan dosen di fase awal.

---

## 3. Platform

- **Web Application** berbasis **PWA (Progressive Web App)**
  - Dapat diinstal ke home screen (desktop & mobile)
  - Mendukung mode offline terbatas (caching soal yang sedang dikerjakan, agar koneksi tidak stabil tidak menggagalkan sesi tes)
  - Responsive design (desktop, tablet, mobile)
  - Notifikasi push (opsional, untuk reminder)

---

## 4. Lingkup Fitur (Scope)

### 4.1 Format Tes - TOEFL ITP

Mengacu pada format TOEFL ITP resmi:

Mengikuti jumlah soal dan alokasi waktu **TOEFL ITP asli** secara persis:

| Section | Jumlah Soal | Waktu Resmi | Skill |
|---|---|---|---|
| **Section 1: Listening Comprehension** | 50 soal (Part A: 30, Part B: 8, Part C: 12) | ± 35 menit (mengikuti durasi audio asli) | Mendengarkan dialog, percakapan, dan ceramah pendek |
| **Section 2: Structure and Written Expression** | 40 soal (Structure 15, Written Expression 25) | 25 menit | Tata bahasa/grammar |
| **Section 3: Reading Comprehension** | 50 soal (± 5 passage) | 55 menit | Pemahaman teks bacaan |

**Total**: 140 soal, total waktu pengerjaan ± 115 menit (sesuai standar resmi TOEFL ITP).

### 4.2 Modul Utama

#### A. Modul Mahasiswa
1. **Autentikasi**
   - Registrasi & login (email/NIM, password)
   - Lupa password
2. **Dashboard Mahasiswa**
   - Ringkasan progress (skor terakhir, rata-rata skor, jumlah tes yang sudah dikerjakan)
   - Rekomendasi/tombol mulai tes baru
   - Grafik perkembangan skor dari waktu ke waktu
3. **Pemilihan Paket Tes**
   - Daftar paket tes (set soal) yang tersedia
   - Pilihan: **Full Test** (3 section lengkap dengan timer) atau **Latihan per Section** (latihan section tertentu saja, misal hanya Listening)
   - Setiap paket dapat dipilih dalam dua mode:
     - **Mode Dengan Waktu (Timed Mode)**: timer berjalan sesuai durasi resmi TOEFL ITP, mensimulasikan kondisi ujian sungguhan
     - **Mode Tanpa Waktu (Untimed/Practice Mode)**: tidak ada batasan waktu, untuk latihan santai dan pembelajaran. Hasil tetap ditampilkan & disimpan, namun ditandai sebagai "Latihan" pada riwayat
   - **Pembatasan Full Test**: mahasiswa hanya dapat mengerjakan **Full Test (Mode Dengan Waktu)** maksimal **1 kali per minggu** per akun. Sistem menampilkan countdown waktu tersisa hingga kesempatan berikutnya tersedia. Pembatasan ini **tidak berlaku** untuk Latihan per Section maupun Mode Tanpa Waktu (dapat dikerjakan berulang kali)
4. **Ruang Tes (Test Room / Exam Engine)**
   - Tampilan antarmuka tes menyerupai ujian resmi (timer berjalan, navigasi soal, indikator soal terjawab/belum)
   - **Section Listening**: pemutar audio terintegrasi (audio dapat berupa file upload admin atau text-to-speech), audio hanya dapat diputar sekali (sesuai aturan TOEFL asli), opsi disable replay
   - **Section Structure**: tampilan soal pilihan ganda dengan kalimat berisi bagian yang digarisbawahi/kosong
   - **Section Reading**: tampilan teks bacaan di satu panel & soal di panel lain (split-view), mendukung scroll independen
   - Navigasi: tombol Next/Previous, navigator soal (grid nomor soal), tombol "Tandai untuk ditinjau"
   - Auto-submit ketika waktu section habis
   - Auto-save jawaban (mencegah kehilangan data jika koneksi terputus, didukung PWA offline cache)
5. **Hasil Tes**
   - Skor per section (skala TOEFL: Listening 31-68, Structure 31-68, Reading 31-67)
   - **Skor total konversi (skala 310-677)** menggunakan tabel konversi resmi TOEFL ITP
   - Review jawaban: soal benar/salah, kunci jawaban, pembahasan (jika tersedia)
   - **Analisis kelemahan per skill**, contoh:
     - Listening: Part A (Short Dialogues), Part B (Longer Conversations), Part C (Talks)
     - Structure: Structure vs Written Expression
     - Reading: per tipe soal (main idea, detail, inference, vocabulary, dll.)
   - Rekomendasi area yang perlu diperbaiki
   - **Unduh Sertifikat Hasil Simulasi (PDF)**: tombol untuk mengunduh hasil tes dalam format PDF berisi nama mahasiswa, tanggal tes, skor per section, skor total, dan keterangan "Hasil Simulasi - Bukan Sertifikat Resmi TOEFL". Tersedia untuk Full Test (Mode Dengan Waktu); opsional untuk mode latihan/tanpa waktu
6. **Riwayat Progress**
   - Riwayat seluruh tes yang pernah dikerjakan (tanggal, skor, durasi)
   - Grafik tren skor per section dari waktu ke waktu
   - Perbandingan dengan skor sebelumnya

#### B. Modul Admin
1. **Autentikasi Admin** (role-based access)
2. **Manajemen Bank Soal**
   - **Input Manual**: form untuk menambahkan soal per section (teks, pilihan jawaban, kunci jawaban, kategori skill, pembahasan, upload gambar/audio jika diperlukan)
   - **Import Massal**: upload file Excel/CSV berisi banyak soal sekaligus, dengan template yang disediakan & validasi format sebelum disimpan
   - Pengelompokan soal berdasarkan kategori skill (untuk keperluan analisis kelemahan)
3. **Manajemen Audio Listening**
   - Upload file audio (mp3/wav) per soal atau per set passage
   - Opsi alternatif: generate audio otomatis dari transkrip menggunakan Text-to-Speech (TTS), dengan pilihan suara (aksen Inggris/Amerika)
   - Admin dapat memilih: pakai audio upload atau audio hasil TTS untuk tiap soal/set
4. **Manajemen Paket Tes**
   - Membuat/menyusun paket tes (kombinasi soal dari bank soal menjadi satu set Full Test atau Latihan per Section)
   - Mengatur durasi waktu per section
   - Status paket: draft/published
5. **Manajemen Tabel Konversi Skor**
   - Input/edit tabel konversi raw score ke scaled score per section, dan formula skor total TOEFL ITP

---

## 5. Alur Pengguna Utama (User Flow)

### 5.1 Flow Mahasiswa - Mengerjakan Full Test
1. Login → Dashboard
2. Pilih "Mulai Tes Baru" → Pilih paket "Full Test ITP"
3. Layar instruksi & konfirmasi mulai tes
4. **Section Listening** (timer berjalan otomatis, audio diputar sesuai urutan, tidak bisa pause/replay)
5. Transisi otomatis ke **Section Structure** (timer baru dimulai)
6. Transisi otomatis ke **Section Reading** (timer baru dimulai)
7. Auto-submit setelah section terakhir selesai atau waktu habis
8. Halaman "Hasil Tes" → skor per section, skor total, analisis kelemahan
9. Hasil tersimpan ke riwayat progress

### 5.2 Flow Mahasiswa - Latihan per Section
1. Login → Dashboard
2. Pilih "Latihan" → pilih section (misal: Reading saja)
3. Pilih paket latihan reading
4. Kerjakan dengan timer (opsional: mode tanpa timer untuk latihan santai)
5. Hasil & pembahasan langsung ditampilkan per soal

### 5.3 Flow Admin - Menambah Soal Massal
1. Login admin → Menu Bank Soal
2. Unduh template Excel/CSV
3. Isi template (soal, pilihan, kunci, kategori skill, audio reference jika listening)
4. Upload file → sistem validasi format & menampilkan preview
5. Konfirmasi import → soal masuk ke bank soal, siap digunakan dalam paket tes

---

## 6. Persyaratan Fungsional (Functional Requirements)

| ID | Requirement |
|---|---|
| FR-01 | Sistem dapat melakukan registrasi dan autentikasi mahasiswa |
| FR-02 | Sistem menyediakan engine tes dengan timer per section sesuai format ITP |
| FR-03 | Sistem dapat memutar audio listening (upload manual maupun hasil TTS) dengan kontrol pemutaran sekali (no pause/replay) sesuai aturan resmi |
| FR-04 | Sistem dapat menampilkan soal Reading dengan tata letak split passage-soal |
| FR-05 | Sistem melakukan auto-save jawaban secara berkala dan auto-submit saat waktu habis |
| FR-06 | Sistem menghitung raw score per section dan mengonversinya ke scaled score (310-677) berdasarkan tabel konversi TOEFL ITP |
| FR-07 | Sistem menyajikan analisis kelemahan berdasarkan kategori skill pada setiap soal |
| FR-08 | Sistem menyimpan riwayat seluruh hasil tes mahasiswa dan menampilkannya dalam bentuk grafik tren |
| FR-09 | Admin dapat menambah/mengedit/menghapus soal secara manual termasuk upload gambar dan audio |
| FR-10 | Admin dapat melakukan import soal massal melalui file Excel/CSV dengan validasi format |
| FR-11 | Admin dapat membuat dan mengatur paket tes (Full Test atau per Section) |
| FR-12 | Admin dapat mengatur/mengubah tabel konversi skor |
| FR-13 | Aplikasi berjalan sebagai PWA: dapat diinstal, dan mendukung caching soal aktif untuk mode minim koneksi |
| FR-14 | Sistem menyediakan dua mode pengerjaan: Timed Mode (sesuai durasi resmi TOEFL ITP) dan Untimed/Practice Mode |
| FR-15 | Sistem membatasi pengerjaan Full Test (Timed Mode) maksimal 1 kali per minggu per akun mahasiswa |
| FR-16 | Sistem dapat menghasilkan dan mengunduh sertifikat hasil simulasi dalam format PDF |

---

## 7. Persyaratan Non-Fungsional

| Kategori | Deskripsi |
|---|---|
| **Performa** | Halaman tes harus tetap responsif meski memuat audio & gambar; loading awal paket tes < 3 detik dalam koneksi normal |
| **Keandalan** | Auto-save jawaban setiap perpindahan soal/section untuk mencegah kehilangan data |
| **Keamanan** | Password terenkripsi, sesi tes terikat per user, mencegah satu akun login ganda saat tes berlangsung |
| **Kompatibilitas** | Mendukung browser modern (Chrome, Edge, Safari, Firefox) di desktop & mobile |
| **Skalabilitas** | Mendukung bank soal dengan ribuan item & ratusan pengguna bersamaan |
| **Aksesibilitas** | UI tes menyerupai tampilan ujian resmi agar familiar bagi mahasiswa |

---

## 8. Skema Data (High-Level)

### Entitas Utama
- **User** (mahasiswa/admin): id, nama, email/NIM, password, role
- **Question Bank**: id, section (Listening/Structure/Reading), skill_category, tipe soal, konten soal, pilihan jawaban, kunci jawaban, pembahasan, referensi audio (jika ada), referensi passage (untuk reading)
- **Passage**: id, judul, isi teks (untuk Reading), terkait dengan banyak soal
- **Audio**: id, file_url/TTS reference, transkrip, terkait dengan soal/set listening
- **Test Package**: id, nama paket, tipe (Full Test/Latihan), daftar soal per section, durasi per section, status
- **Test Attempt**: id, user_id, package_id, tanggal, durasi pengerjaan, jawaban per soal, raw score per section, scaled score per section, total score
- **Score Conversion Table**: section, raw_score, scaled_score

---

## 9. Skema Penilaian (Scoring Logic)

1. Hitung **raw score** per section = jumlah jawaban benar.
2. Konversi raw score → **scaled score** per section menggunakan Score Conversion Table:
   - Listening: skala 31-68
   - Structure: skala 31-68
   - Reading: skala 31-67
3. Hitung **skor total**:
   ```
   Total Score = ((Listening Scaled + Structure Scaled + Reading Scaled) / 3) x 10
   ```
   Hasil dibulatkan ke nilai terdekat dalam skala 310-677.
4. Simpan hasil per kategori skill (untuk analisis kelemahan), misalnya:
   - Listening: Part A / Part B / Part C
   - Structure: Structure / Written Expression
   - Reading: Main Idea / Detail / Inference / Vocabulary / Reference / dll.

---

## 10. Out of Scope (Fase 1)

- Speaking & Writing section (TOEFL ITP tidak mencakup ini, tetap di luar lingkup)
- Manajemen kelas oleh dosen, laporan agregat per kelas/angkatan
- Integrasi dengan sistem akademik kampus (SIAKAD)
- Tes dengan proktor/pengawasan online (anti-cheating advanced seperti webcam monitoring)
- Aplikasi mobile native terpisah (cukup PWA)

---

## 11. Roadmap Pengembangan (Usulan)

| Fase | Fokus |
|---|---|
| **Fase 1 (MVP)** | Autentikasi, bank soal manual, 1 paket Full Test, exam engine 3 section, scoring & hasil dasar |
| **Fase 2** | Import massal soal, TTS audio, analisis kelemahan per skill, riwayat progress & grafik |
| **Fase 3** | PWA offline mode penuh, multiple paket tes, fitur latihan per section, peningkatan UI/UX |
| **Fase 4 (opsional)** | Modul admin lanjutan (statistik agregat), integrasi akademik, notifikasi push |
