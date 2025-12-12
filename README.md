
<div align="center">
    <img width="380" src="https://i.pinimg.com/originals/13/9b/3b/139b3b57a041f24fb792d94d022baa2c.gif" />
</div>
<br/>

<div align="center">
    <h1 > Documentation API SIMJUR </h1>
    <p >Created By : Power Ranger</p>
</div>


# Anggota Tim :

<div align="center">

| ![Avatar 1](public/readme/sigma-1.jpeg) | ![Avatar 2](public/readme/sigma-2.jpeg) | ![Avatar 3](public/readme/sigma-3.jpeg) | ![Avatar 4](public/readme/sigma-4.jpeg) | ![Avatar 5](https://i.pinimg.com/1200x/eb/ee/f6/ebeef61d5884dba8c382eca6b9de87ca.jpg) |
|:----:|:----:|:----:|:----:|:----:|
| Abdul Halim<br/>Backend Developer | Anugerah Rachmat Indriansyah<br/> Frontend Developer | M. Rangga Fabiano M <br/>Backend Developer | Nail Rizq Widiyanto<br/> Frontend Developer | Gedebong Pisang <br/> Analyst System |

</div>


----

# Daftar Pustaka : 
- [Anggota Tim :](#anggota-tim-)
- [Daftar Pustaka :](#daftar-pustaka-)
- [Struktur Direktori File :](#struktur-direktori-file-)
- [Installasi :](#installasi-)
- [API Testing](#api-testing)
- [Regiser - POST](#regiser---post)
    - [**Success \[200\]** ](#success-200-)
    - [Error Duplicate - 500](#error-duplicate---500)
- [Login](#login)
    - [Success - Has Been Login](#success---has-been-login)
    - [Error :](#error-)
- [User](#user)
  - [GET RESPONSE](#get-response)
    - [Get All User](#get-all-user)
    - [Get User By Id](#get-user-by-id)
    - [Error - Berier token Expired :](#error---berier-token-expired-)
    - [POST](#post)
    - [PUT](#put)
    - [DELET](#delet)
- [Roles](#roles)
    - [GET](#get)
    - [POST](#post-1)
    - [**Success \[200\]** ](#success-200--1)
    - [Error Duplicate - 500](#error-duplicate---500-1)


# Struktur Direktori File : 
```json
supabase-api-simjur/
├─ app/
│  ├─ api/
│  │  ├─ auth/
│  │  │  ├─ login/
│  │  │  │  └─ route.ts
│  │  │  └─ register/
│  │  │     └─ route.ts
│  │  ├─ user/
│  │  │  ├─ route.ts
│  │  │  └─ [id]/
│  │  │     └─ route.ts
│  │  ├─ roles/
│  │  │  └─ route.ts
│  │  ├─ transaksi/
│  │  │  ├─ route.ts
│  │  │  └─ [id]/
│  │  │     └─ route.ts
│  │  ├─ module/
│  │  │  └─ route.ts
│  │  ├─ module_access/
│  │  │  └─ route.ts
│  │  ├─ pengajuan/
│  │  │  ├─ tor/
│  │  │  │  └─ route.ts
│  │  │  └─ lpj/
│  │  │     └─ route.ts
│  │  ├─ archive/
│  │  │  ├─ tor/
│  │  │  │  └─ route.ts
│  │  │  └─ lpj/
│  │  │     └─ route.ts
│  │  └─ test/
│  │     └─ route.ts
│  ├─ lib/
│  │  ├─ supabaseClient.ts
│  │  ├─ auth.ts
│  │  └─ middleware.ts
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ layout.tsx
│  └─ page.tsx
├─ public/
│  ├─ readme/
│  │  ├─ sigma-1.jpeg
│  │  ├─ sigma-2.jpeg
│  │  ├─ sigma-3.jpeg
│  │  ├─ sigma-4.jpeg
│  │  └─ sigma-5.jpeg
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ next.svg
│  ├─ vercel.svg
│  └─ window.svg
├─ .gitignore
├─ LICENSE
├─ README.md
├─ api.txt
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
└─ tsconfig.json
```

# Installasi : 
- **npm**
```terminal
# first install the depenencis
npm install

# run project 
npm run dev
```
- **yarn**
```terminal
# first install the depenencis
yarn install

# run project 
yarn run dev
```

# API Documentation

## Overview
SIMJUR API is a RESTful API built with Next.js and Supabase for managing student activities, users, roles, modules, submissions, and financial transactions.

## Base URL
```
http://localhost:3000/api
```

## Authentication
Most endpoints require JWT token authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "nim": "string",
  "program_studi": "string",
  "roles_id": "number",
  "description": "string (optional)",
  "password": "string"
}
```

**Response (200):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 13,
    "name": "admin",
    "email": "admin@example.com",
    "nim": "12345678",
    "program_studi": "Teknik Informatika",
    "roles_id": 1,
    "description": "admin user"
  }
}
```

#### POST /auth/login
Authenticate user and get JWT token.

**Request Body:**
```json
{
  "identifier": "string", // name, email, or NIM
  "password": "string"
}
```

**Response (200):**
```json
{
  "message": "Login success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 4,
    "name": "danu",
    "email": "danu@example.com",
    "nim": "12345678",
    "program_studi": "Teknik Informatika",
    "roles_id": 1
  }
}
```

### User Management

#### GET /user
Get all users with role details.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "users": [
    {
      "id": 2,
      "name": "halim",
      "email": "halim@example.com",
      "nim": "12345678",
      "program_studi": "Teknik Informatika",
      "description": "admin user",
      "roles_id": 1,
      "roles_table": {
        "id_roles": 1,
        "name_roles": "admin",
        "keterangan": "ini admin besar"
      }
    }
  ]
}
```

#### GET /user/[id]
Get specific user by ID.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "user": {
    "id": 2,
    "name": "halim",
    "email": "halim@example.com",
    "nim": "12345678",
    "program_studi": "Teknik Informatika",
    "description": "admin user",
    "roles_id": 1,
    "roles_table": {
      "id_roles": 1,
      "name_roles": "admin",
      "keterangan": "ini admin besar"
    }
  }
}
```

#### POST /user
Create new user.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "nim": "string",
  "program_studi": "string",
  "roles_id": "number",
  "description": "string (optional)",
  "password": "string"
}
```

#### PUT /user/[id]
Update user completely.

**Headers:** `Authorization: Bearer <token>`

#### PATCH /user/[id]
Update user partially.

**Headers:** `Authorization: Bearer <token>`

#### DELETE /user/[id]
Delete user by ID.

**Headers:** `Authorization: Bearer <token>`

### Role Management

#### GET /roles
Get all roles.

**Headers:** `Authorization: Bearer <token>`

**Response (200):**
```json
{
  "roles": [
    {
      "id_roles": 1,
      "name_roles": "admin",
      "keterangan": "ini admin besar"
    }
  ]
}
```

#### POST /roles
Create new role.

**Request Body:**
```json
{
  "name_roles": "string",
  "keterangan": "string (optional)"
}
```

**Response (200):**
```json
{
  "message": "Role created successfully",
  "role": {
    "id_roles": 2,
    "name_roles": "administrasi",
    "keterangan": "Role dengan akses penuh"
  }
}
```

#### PUT /roles/[id]
Update role completely.

**Headers:** `Authorization: Bearer <token>`

#### PATCH /roles/[id]
Update role partially.

**Headers:** `Authorization: Bearer <token>`

#### DELETE /roles/[id]
Delete role by ID.

**Headers:** `Authorization: Bearer <token>`

### Module Management

#### GET /module
Get all modules.

**Headers:** `Authorization: Bearer <token>`

#### POST /module
Create new module.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "module_name": "string",
  "description": "string (optional)"
}
```

#### DELETE /module
Delete module by ID.

**Headers:** `Authorization: Bearer <token>`

### Module Access Control

#### GET /module_access
Get all module access permissions.

**Headers:** `Authorization: Bearer <token>`

#### POST /module_access
Create module access permission.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "role_id": "number",
  "module_id": "number",
  "can_view": "boolean (optional)",
  "can_create": "boolean (optional)",
  "can_edit": "boolean (optional)",
  "can_delete": "boolean (optional)"
}
```

#### PATCH /module_access
Update module access permission.

**Headers:** `Authorization: Bearer <token>`

#### DELETE /module_access
Delete module access permission.

**Headers:** `Authorization: Bearer <token>`

### Pengajuan (Submissions)

#### LPJ (Laporan Pertanggungjawaban)

##### GET /pengajuan/lpj
Get all LPJ submissions.

**Headers:** `Authorization: Bearer <token>`

##### POST /pengajuan/lpj
Create new LPJ submission.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "nomor_surat": "string",
  "nama_kegiatan": "string",
  "tujuan": "string",
  "latar_belakang": "string",
  "peserta": "string",
  "jadwal_awal": "string",
  "jadwal_akhir": "string",
  "anggaran": "number",
  "pic": "string",
  "upload_file": "string",
  "estimasi_jadwal": "string",
  "status": "string (optional)",
  "catatan_pengajuan": "string (optional)",
  "admin_id": "number",
  "admin_name": "string"
}
```

##### PUT /pengajuan/lpj
Update LPJ submission.

**Headers:** `Authorization: Bearer <token>`

##### DELETE /pengajuan/lpj
Delete LPJ submission.

**Headers:** `Authorization: Bearer <token>`

#### TOR (Term of Reference)

##### GET /pengajuan/tor
Get all TOR submissions.

**Headers:** `Authorization: Bearer <token>`

##### POST /pengajuan/tor
Create new TOR submission.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "nomor_surat": "string",
  "nama_kegiatan": "string",
  "tujuan": "string",
  "latar_belakang": "string",
  "tanggal_pengajuan": "string",
  "nominal_pengajuan": "number",
  "peserta": "string",
  "jadwal_awal": "string",
  "jadwal_akhir": "string",
  "anggaran": "number",
  "pic": "string",
  "upload_file": "string",
  "pengaju_id": "number",
  "user_id": "number"
}
```

##### PUT /pengajuan/tor
Update TOR submission.

**Headers:** `Authorization: Bearer <token>`

##### DELETE /pengajuan/tor
Delete TOR submission.

**Headers:** `Authorization: Bearer <token>`

### Transaction Management

#### GET /transaksi
Get all transactions.

**Headers:** `Authorization: Bearer <token>`

#### GET /transaksi/[id]
Get specific transaction by ID.

**Headers:** `Authorization: Bearer <token>`

#### POST /transaksi
Create new transaction.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "anggaran_id": "number",
  "jenis_transaksi": "string",
  "jumlah": "number",
  "keterangan": "string (optional)",
  "tanggal": "string"
}
```

#### PUT /transaksi/[id]
Update transaction.

**Headers:** `Authorization: Bearer <token>`

#### DELETE /transaksi/[id]
Delete transaction.

**Headers:** `Authorization: Bearer <token>`

### Archive Endpoints
*Note: Archive endpoints are not implemented yet and return "not implemented yet" message.*

#### /archive/lpj
#### /archive/tor

### Utility

#### GET /test
Test API connectivity.

**Response (200):**
```json
{
  "message": "✅ API route nyambung mang!"
}
```

## Error Responses

### Invalid or Expired Token (401)
```json
{
  "error": "Invalid or expired token. Please login again to get a new token.",
  "code": "INVALID_TOKEN",
  "timeStamp": "Wed Nov 26 2025 03:03:06 GMT+0700 (Western Indonesia Time)"
}
```

### Duplicate Entry (409)
```json
{
  "error": "duplicate key value violates unique constraint \"user_list_email_key\"",
  "code": "23505",
  "timeStamp": "Wed Nov 26 2025 03:04:37 GMT+0700 (Western Indonesia Time)"
}
```

### Not Found (404)
```json
{
  "error": "User not found"
}
```

### Validation Error (400)
```json
{
  "error": "Invalid email format"
}
```

## Common Features

- **Authentication**: JWT-based authentication with 2-hour token expiry
- **Validation**: Email format validation, unique constraints for email and NIM
- **Security**: Password hashing with bcryptjs
- **Database**: Supabase as backend with proper relationship handling
- **Error Handling**: Consistent error response format with appropriate HTTP status codes
