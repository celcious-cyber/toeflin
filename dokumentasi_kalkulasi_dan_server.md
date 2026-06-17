# 📊 Dokumentasi Rumus Kalkulasi Skor TOEFLin & Analisis Kebutuhan Server

Dokumen ini menjelaskan secara rinci mekanisme perhitungan skor TOEFL ITP (standar 140 soal) serta analisis kebutuhan infrastruktur server/VPS untuk melayani ujian bersamaan (*concurrent*) bagi 100+ mahasiswa.

---

## 1. Rumus Perhitungan Skor TOEFL ITP (Standar 140 Soal)

Aplikasi TOEFLin menggunakan algoritma penilaian TOEFL ITP resmi yang dinormalisasi ke rentang skor **310 hingga 677**.

### A. Struktur Seksi Ujian (Standar 140 Soal)
Secara standar internasional, TOEFL ITP terdiri dari **140 soal**:
* **Section 1: Listening Comprehension** (50 soal)
* **Section 2: Structure & Written Expression** (40 soal)
* **Section 3: Reading Comprehension** (50 soal)

Sistem backend TOEFLin akan menghitung pembagi secara dinamis berdasarkan jumlah soal per seksi yang aktif di database.

### B. Algoritma Perhitungan di Backend
Aplikasi backend menghitung nilai menggunakan **Tabel Konversi Skor (Score Conversion)** yang tersimpan di database. Jika nilai konversi mentah tidak ditemukan, backend menerapkan rumus interpolasi linier presisi sebagai berikut:

$$\text{Scaled Score} = \text{Min Scaled} + \left( \frac{\text{Raw Score}}{\text{Total Questions}} \times (\text{Max Scaled} - \text{Min Scaled}) \right)$$

Di mana rentang nilai konversi per seksi adalah:
* **Listening**: Min Scaled = **31**, Max Scaled = **68**
* **Structure**: Min Scaled = **31**, Max Scaled = **68**
* **Reading**: Min Scaled = **31**, Max Scaled = **67**

#### Rumus Skor Akhir TOEFL:
$$\text{Total Score} = \text{Round} \left( \frac{\text{Scaled Listening} + \text{Scaled Structure} + \text{Scaled Reading}}{3} \times 10 \right)$$

---

### C. Simulasi Perhitungan (Skenario Standar 140 Soal)
Distribusi soal:
* **Listening**: 50 soal
* **Structure**: 40 soal
* **Reading**: 50 soal

#### Kasus 1: Mahasiswa menjawab salah semua (Skor Mentah = 0)
* **Listening Scaled**: $31 + (0 / 50) \times (68 - 31) = 31$
* **Structure Scaled**: $31 + (0 / 40) \times (68 - 31) = 31$
* **Reading Scaled**: $31 + (0 / 50) \times (67 - 31) = 31$
* **Total Score**: $\text{Round}(((31 + 31 + 31) / 3) \times 10) = \mathbf{310}$ *(Skor Minimum TOEFL)*

#### Kasus 2: Mahasiswa menjawab benar semua (Skor Mentah Maksimum)
* **Listening Scaled**: $31 + (50 / 50) \times 37 = 68$
* **Structure Scaled**: $31 + (40 / 40) \times 37 = 68$
* **Reading Scaled**: $31 + (50 / 50) \times 36 = 67$
* **Total Score**: $\text{Round}(((68 + 68 + 67) / 3) \times 10) = \text{Round}(67.6667 \times 10) = \mathbf{677}$ *(Skor Maksimum TOEFL)*

#### Kasus 3: Nilai Acak (Contoh Jawaban Benar: L = 35/50, S = 28/40, R = 42/50)
* **Listening Scaled**: $31 + (35 / 50) \times 37 = 31 + 25.9 = 56.9 \approx 57$
* **Structure Scaled**: $31 + (28 / 40) \times 37 = 31 + 25.9 = 56.9 \approx 57$
* **Reading Scaled**: $31 + (42 / 50) \times 36 = 31 + 30.24 = 61.24 \approx 61$
* **Total Score**: $\text{Round}(((57 + 57 + 61) / 3) \times 10) = \text{Round}(58.3333 \times 10) = \mathbf{583}$

---

## 2. Analisis Kebutuhan Server untuk 100+ Mahasiswa Concurrent

Menjalankan ujian berbasis CBT (Computer Based Test) secara bersamaan oleh 100+ mahasiswa memiliki karakteristik beban server yang sangat berbeda dari aplikasi web biasa. 

### A. Titik Kritis Beban Server (Bottlenecks)
1. **Audio Streaming I/O (Seksi Listening)**:
   100 mahasiswa akan memutar file audio (.mp3) seksi Listening dalam waktu yang hampir bersamaan. Jika ukuran audio adalah 15 MB, server harus menyajikan data sebesar **1.5 GB secara instan**. Ini menguras bandwidth jaringan (*throughput*) dan disk read I/O server utama.
2. **Database Write Locks (Auto-Save)**:
   Aplikasi mengirimkan request simpan jawaban otomatis secara berkala. Jika 100 mahasiswa mengirim data setiap 10-15 detik, database akan menerima **400 - 600 operasi tulis per menit**. SQLite bawaan dapat mengalami *database locked* karena tidak dirancang untuk operasi tulis paralel intensif.
3. **Spawning Node.js (Memory & CPU)**:
   Node.js Next.js standalone dan NestJS backend membutuhkan resource CPU untuk menangani koneksi SSL/TLS dan perutean HTTP.
4. **PDF Generation (Sertifikat)**:
   Jika sertifikat di-generate menggunakan library PDF di sisi server secara instan saat tombol submit ditekan oleh 100 orang bersamaan, server akan langsung kelebihan beban (CPU 100%) dan hang.

---

### B. Mengapa Shared Web Hosting Gagal (Error 503)?
Shared web hosting menggunakan CloudLinux LVE untuk membatasi resource per akun (biasanya dibatasi pada **Physical Memory (PMEM) 1 GB - 2 GB** dan **Entry Processes (EP) 20 - 30**). 
* Begitu 20+ mahasiswa melakukan koneksi aktif bersamaan (membuka halaman, streaming audio, auto-save), limit proses (NPROC) langsung tercapai.
* Apache/Passenger akan menolak permintaan koneksi berikutnya dan mengembalikan error **`503 Service Unavailable / Server Busy`** (seperti yang Anda alami saat ini).

---

### C. Rekomendasi Spesifikasi VPS (Virtual Private Server)

Untuk melayani **100 - 200 mahasiswa secara concurrent (bersamaan)** dengan lancar, sangat direkomendasikan bermigrasi dari Shared Hosting ke VPS SSD dengan spesifikasi berikut:

| Komponen | Spesifikasi Minimum | Spesifikasi Rekomendasi |
| :--- | :--- | :--- |
| **CPU (Processor)** | 2 Cores (Intel Xeon / AMD EPYC) | **4 Cores** (High Frequency Dedicated) |
| **RAM (Memory)** | 4 GB | **8 GB** |
| **Penyimpanan** | 40 GB SSD / NVMe | **80 GB NVMe SSD** (I/O kecepatan tinggi) |
| **Bandwidth** | 100 Mbps port (Unmetered) | **1 Gbps port** (dengan kuota minimal 2 TB) |
| **Sistem Operasi** | Ubuntu 22.04 LTS / Debian 12 | Ubuntu 22.04 LTS / Debian 12 |
| **Web Server** | Nginx + PM2 | Nginx + PM2 (dengan Reverse Proxy) |

---

### D. Rekomendasi Optimasi Arsitektur CBT

Agar VPS dapat bekerja sangat efisien (dan bahkan bisa menekan biaya spesifikasi server), terapkan optimasi arsitektur berikut:

1. **Gunakan External Object Storage untuk Audio & Sertifikat PDF**:
   Jangan simpan atau stream audio dari server utama. Pindahkan file audio ujian ke **Cloudflare R2** or **AWS S3**, lalu pasang CDN **Cloudflare** di depannya. 
   * *Keuntungan*: Beban bandwidth streaming audio 100% ditanggung oleh Cloudflare. VPS Anda bebas dari beban I/O disk.
2. **Upgrade Database ke PostgreSQL atau MariaDB**:
   Gantikan SQLite bawaan di backend dengan **PostgreSQL** atau **MariaDB/MySQL**. Database ini mendukung konkurensi tingkat tinggi dengan baris penguncian (*row-level locking*), mencegah terjadinya antrean tulis saat auto-save.
3. **Gunakan PM2 Cluster Mode**:
   Nyalakan backend NestJS and frontend Next.js menggunakan utility **PM2** di VPS dalam mode cluster. Ini membagi beban kerja secara merata ke semua Core CPU yang tersedia.
4. **Queue (Antrean) untuk PDF Generator**:
   Jangan men-generate sertifikat PDF secara instan ketika ujian dikirimkan. Gunakan sistem antrean (*queue*) di backend, atau buat sertifikat baru di-render saat mahasiswa mengeklik tombol "Unduh Sertifikat" di halaman Riwayat (bukan otomatis setelah submit ujian).
