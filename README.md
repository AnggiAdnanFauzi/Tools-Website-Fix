# Tools Website

Repositori ini menggabungkan dua platform aplikasi:
1. **Financial Health Platform (`financial_health-main`)**
2. **TalentStream (`TalentStream-main`)**

---

## Struktur Repositori

```text
Tools Website/
├── financial_health-main/
│   ├── backend/             # Laravel API backend
│   ├── frontend_admin/      # Dashboard Admin (Vite / React)
│   └── frontend_user/       # Portal Pengguna (Vite / React)
│
├── TalentStream-main/
│   ├── backend/             # Laravel API backend
│   ├── frontend-admin/      # Dashboard Admin TalentStream
│   └── frontend-user/       # Portal User TalentStream
│
├── .gitignore               # Konfigurasi pengabaian file sensitif
└── README.md
```

---

## Panduan Pengaturan Lingkungan (Environment Setup)

Semua file environment (`.env`) dan kredensial sensitif dikecualikan dari repositori ini demi alasan keamanan. Untuk menjalankan proyek secara lokal, salin file contoh dan sesuaikan nilainya:

### 1. Financial Health Platform
- **Backend**:
  ```bash
  cd financial_health-main/backend
  cp .env.example .env
  php artisan key:generate
  ```
- **Frontend Admin**:
  ```bash
  cd financial_health-main/frontend_admin
  cp .env.example .env
  ```
- **Frontend User**:
  ```bash
  cd financial_health-main/frontend_user
  cp .env.example .env
  ```

### 2. TalentStream
- **Backend**:
  ```bash
  cd TalentStream-main/backend
  cp .env.example .env
  php artisan key:generate
  ```
- **Frontend Admin**:
  ```bash
  cd TalentStream-main/frontend-admin
  cp .env.example .env
  ```
- **Frontend User**:
  ```bash
  cd TalentStream-main/frontend-user
  cp .env.example .env
  ```

---

## Keamanan Data
Repositori ini telah dikonfigurasi dengan `.gitignore` ketat untuk mencegah kebocoran:
- Kunci API (misal Gemini API Key)
- Berkas basis data (`.sqlite`, `.sql`)
- Kredensial server dan database (`.env`)
- Dependensi (`node_modules/`, `vendor/`)
