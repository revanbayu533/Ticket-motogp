# MotoTix - Official MotoGP™ Grand Prix Ticketing System

[![Node Version](https://img.shields.io/badge/Node.js-v20%2B-339933?logo=node.js)](https://nodejs.org)
[![NestJS](https://img.shields.io/badge/Backend-NestJS-E0234E?logo=nestjs)](https://nestjs.com)
[![React Vite](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?logo=react)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Prisma ORM](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/Database-Neon%20PostgreSQL-4169E1?logo=postgresql)](https://neon.tech)

**MotoTix** adalah fondasi sistem ticketing resmi berstandar internasional untuk ajang balap dunia **MotoGP™** dan **Pertamina Mandalika International Circuit**. Platform ini menyediakan alur pemesanan tiket terintegrasi, manajemen zona tribun dan paket VIP Hospitality, verifikasi kode booking unik, serta siaran notifikasi transaksi langsung (real-time).

---

## 📌 Gambaran Proyek & Fitur Utama

- **Identitas & Branding Terpadu**: Menggunakan nama resmi **MotoTix** pada antarmuka web, favicon balap kustom, judul halaman `<title>`, header, judul notifikasi, serta template email konfirmasi HTML resmi.
- **Backend Skalabel (NestJS)**: Dilengkapi `ConfigModule` global, CORS terkonfigurasi, prefix global `/api`, validasi DTO, dan dokumentasi interaktif **Swagger API** di `/api/docs`.
- **Frontend Modern & Berkecepatan Tinggi (React Vite + Tailwind CSS)**: Antarmuka gelap bernuansa balap sirkuit (*carbon texture* dan *MotoGP Red* `#E10600`), interaktif memilih zona dan melihat fasilitas, simulasi pemesanan dengan penerbitan E-Ticket QR Code, serta laci notifikasi siaran langsung.
- **Basis Data PostgreSQL (Neon Cloud) + Prisma**: Terdiri dari 6 tabel relasional (`users`, `events`, `zones`, `orders`, `tickets`, `payments`) dengan indeks unik pada `booking_code` dan `ticket_number`.
- **Seeding Data Otomatis**: Dilengkapi seed data sirkuit Mandalika 2026, zona VIP Deluxe, Grandstand A/C/J, tiket Festival Bukit Seger, serta contoh pesanan dan pembayaran terverifikasi.
- **Standar Kode**: Terpasang ESLint dan Prettier untuk menjaga kualitas dan format kode di backend dan frontend.

---

## 🗂️ Struktur Direktori Proyek

```text
Ticket-motogp/
├── docs/
│   └── erd.md                      # Diagram Relasi Entitas (Mermaid ERD) & kamus tabel
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma           # Skema Prisma untuk 6 tabel relasional
│   │   └── seed.ts                 # Script seeding data awal sirkuit & zona Mandalika
│   ├── src/
│   │   ├── modules/
│   │   │   ├── health/             # Health check endpoint & status database
│   │   │   ├── events/             # Controller & Service ajang balap dan zona harga
│   │   │   └── notifications/      # Service email template MotoTix & siaran Pusher
│   │   ├── prisma/                 # Global PrismaModule & PrismaService
│   │   ├── app.module.ts           # Root AppModule dengan ConfigModule global
│   │   └── main.ts                 # Bootstrap NestJS, CORS, prefix /api, Swagger
│   ├── .env.example                # Daftar variabel lingkungan backend tanpa nilai
│   ├── eslint.config.mjs           # Konfigurasi ESLint 9
│   ├── tsconfig.json               # Konfigurasi kompilasi TypeScript
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── favicon.svg             # Favicon helm balap MotoTix SVG
│   ├── src/
│   │   ├── components/             # Navbar, Hero, ZoneSelector, BookingModal, Footer
│   │   ├── types/                  # TypeScript interface (Event, Zone, Order, Ticket)
│   │   ├── App.tsx                 # Root application component
│   │   ├── main.tsx                # Entry point React Vite
│   │   └── index.css               # Desain styling Tailwind CSS & nuansa MotoGP
│   ├── .env.example                # Daftar variabel lingkungan frontend tanpa nilai
│   ├── index.html                  # Judul <title> MotoTix & meta SEO
│   ├── tailwind.config.js          # Konfigurasi tema dan palet warna MotoGP
│   ├── vite.config.ts              # Konfigurasi bundler Vite
│   └── package.json
└── README.md
```

---

## 🚀 Panduan Memulai Cepat (Quickstart)

### 1. Kloning Repositori & Cabang
```bash
git clone https://github.com/revanbayu533/Ticket-motogp.git
cd Ticket-motogp
git checkout develop
```

---

### 2. Menjalankan Backend (NestJS)

1. Masuk ke folder `backend`:
   ```bash
   cd backend
   ```
2. Buat file `.env` berdasarkan template:
   ```bash
   cp .env.example .env
   ```
3. Sesuaikan isi `.env` (contoh terisi):
   ```ini
   APP_NAME="MotoTix"
   PORT=3001
   NODE_ENV="development"
   DATABASE_URL="postgresql://username:password@ep-your-host.neon.tech/neondb?sslmode=require"
   JWT_SECRET="your-super-secret-jwt-key"
   JWT_EXPIRES_IN="7d"
   PUSHER_APP_ID="your_pusher_app_id"
   PUSHER_KEY="your_pusher_key"
   PUSHER_SECRET="your_pusher_secret"
   PUSHER_CLUSTER="ap1"
   CORS_ORIGIN="http://localhost:5173"
   ```
4. Pasang dependensi & generate Prisma Client:
   ```bash
   npm install
   npx prisma generate
   ```
5. Jalankan seed data awal:
   ```bash
   npm run prisma:seed
   ```
6. Jalankan server lokal:
   ```bash
   npm run start:dev
   ```
   - **REST API:** `http://localhost:3001/api`
   - **Health Check:** `http://localhost:3001/api/health`
   - **Swagger Docs:** `http://localhost:3001/api/docs`

---

### 3. Menjalankan Frontend (React + Vite + Tailwind)

1. Buka terminal baru dan masuk ke folder `frontend`:
   ```bash
   cd frontend
   ```
2. Buat file `.env`:
   ```bash
   cp .env.example .env
   ```
3. Sesuaikan isi `.env`:
   ```ini
   VITE_APP_NAME="MotoTix"
   VITE_API_BASE_URL="http://localhost:3001/api"
   VITE_PUSHER_KEY="your_pusher_key"
   VITE_PUSHER_CLUSTER="ap1"
   ```
4. Pasang dependensi & jalankan server Vite:
   ```bash
   npm install
   npm run dev
   ```
   Buka peramban di `http://localhost:5173`.

---

## 📊 Skema Database & Relasi (PostgreSQL + Prisma)

Platform **MotoTix** mengelola 6 model utama:
1. **`User` (`users`)**: Akun penonton dan admin sirkuit.
2. **`Event` (`events`)**: Informasi ajang balapan MotoGP resmi.
3. **`Zone` (`zones`)**: Kelas tiket (VIP Deluxe, Grandstand A, C, J, General Admission).
4. **`Order` (`orders`)**: Catatan pemesanan dengan `booking_code` unik terindeks.
5. **`Ticket` (`tickets`)**: Tiket digital resmi dengan `ticket_number` unik terindeks.
6. **`Payment` (`payments`)**: Status pembayaran dan referensi transaksi unik.

Diagram relasi entitas visual lengkap dapat dilihat di [docs/erd.md](docs/erd.md).