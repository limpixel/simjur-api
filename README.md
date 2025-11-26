
<div align="center">
    <img width="380" src="https://i.pinimg.com/originals/6b/8b/9d/6b8b9d3c4c75eaafb73285ddd310a346.gif" />
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
| [Nama Anggota 1]<br/>Backend / Frontend | [Nama Anggota 2]<br/>Backend / Frontend | [Nama Anggota 3]<br/>Backend / Frontend | [Nama Anggota 4]<br/>Backend / Frontend | [Nama Anggota 5]<br/>Backend / Frontend |

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
    - [Success - Has Been Login](#success---has-been-login-1)
    - [Error - Berier token Expired :](#error---berier-token-expired-)
- [USER](#user-1)
    - [GET](#get)
    - [POST](#post)
    - [PUT](#put)
    - [DELET](#delet)
- [Roles](#roles)
    - [GET](#get-1)
    - [POST](#post-1)


# Struktur Direktori File : 
```terminal
backend-simjur-api/
├─ simjur-api-main/
│  ├─ app/
│  │  ├─ api/
│  │  │  ├─ Access Module/
│  │  │  ├─ auth/
│  │  │  │  ├─ login/
│  │  │  │  │  route.ts
│  │  │  ├─ register/
│  │  │  │  └─ route.ts
│  │  │  └─ Module/
│  │  │     └─ route.ts
│  │  ├─ lib/
│  │  │  └─ supabaseClient.ts
│  │  ├─ favicon.ico
│  │  ├─ globals.css
│  │  ├─ layout.tsx
│  │  └─ page.tsx
│  ├─ public/
│  │  │ 
│  │  └─ (aset publik)
│  ├─ .gitignore
│  ├─ api.txt
│  ├─ LICENSE
│  ├─ next.config.ts
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.mjs
│  ├─ README.md
│  └─ tsconfig.json
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

# API Testing 


# Regiser - POST 

### **Success [200]** <br/>
**body** : <br/>
| key            | Value          |
| -------------- | -------------- |
| name [ Text ]  | admin         |
| roles_id [ Text ] | 1 |
| description [ Text ] | admin user |
| password [ Text ] | 12345678 |

**output** : 
```JSON
{
    "message": "User registered successfully",
    "data": [
        {
            "id": 13,
            "name": "admin",
            "roles_id": 1,
            "description": "admin user",
            "password": "$2b$10$2si0cAfV4snLF/e39T8lMOzAWSqRxEh3rWi.Eo8APcUNtei84KW2a"
        }
    ]
}
```
**Penjelasan** : <br/>
>ketika value **name** dan **nomor telepon** terisi dan di submit, maka OTP terkirim kepada user.
<br/>

### Error Duplicate - 500
**body** : <br/>
| key            | Value          |
| -------------- | -------------- |
| name [ Text ]  | Danu         |
| roles_id [ Text ] | 1 |
| description [ Text ] | admin user |
| password [ Text ] | 12345678 |

**output** : 
```JSON
{
    "error": "duplicate key value violates unique constraint \"user_list_password_key\""
}
```
**Penjelasan** : <br/>
>Ketika sebuah akun yag sudah terdaftar maka, tidak bisa di gunakan dan tidak menerima sebuah duplikat data.
<br/>

# Login 
### Success - Has Been Login

**body** : <br/>
| key            | Value          |
| -------------- | -------------- |
| name [ Text ]  | Danu         |
| password [ Text ] | 12345678 |

**Output** :
```json 
{
    "message": "Login success",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwibmFtZSI6ImRhbnUiLCJyb2xlc19pZCI6MSwiaWF0IjoxNzYzNjk3ODQ5LCJleHAiOjE3NjM3MDUwNDl9.Ul6b7dTpK-xEN9MPMk5gzjEvYNGPVRF7an_6mOUy31c",
    "user": {
        "id": 4,
        "name": "danu",
        "roles_id": 1
    }
}
```


### Error : 
**body** : <br/>
| key            | Value          |
| -------------- | -------------- |
| name [ Text ]  | Haji Kembar         |
| password [ Text ] | 12345678 |

**Output** :
```json 
{
    "error": "User not found"
}
```

# User 
## GET RESPONSE
### Success - Has Been Login

**API TESTING **


**Output** :
```json 
{
    "users": [
        {
            "id": 2,
            "name": "halim",
            "description": "admin user",
            "roles_id": 1,
            "roles_table": {
                "id_roles": 1,
                "keterangan": "ini admin besar",
                "name_roles": "admin"
            }
        },
        {
            "id": 3,
            "name": "rangga",
            "description": "admin user",
            "roles_id": 1,
            "roles_table": {
                "id_roles": 1,
                "keterangan": "ini admin besar",
                "name_roles": "admin"
            }
        },
        {
            "id": 4,
            "name": "danu",
            "description": "admin user",
            "roles_id": 1,
            "roles_table": {
                "id_roles": 1,
                "keterangan": "ini admin besar",
                "name_roles": "admin"
            }
        },
    ]
}
```


### Error - Berier token Expired : 
**body** : <br/>
| key            | Value          |
| -------------- | -------------- |
| name [ Text ]  | Haji Kembar         |
| password [ Text ] | 12345678 |

**Output** :
```json 
{
    "error": "Invalid or expired token. Please login again to get a new token.",
    "code": "INVALID_TOKEN",
    "timeStamp": "Wed Nov 26 2025 03:03:06 GMT+0700 (Western Indonesia Time)"
}
```

# USER 
### GET
### POST
### PUT 
### DELET 


# Roles
### GET

### POST 

**Success**
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

**error**
- Invalid or Expired Token 
```json 
{
    "error": "Invalid or expired token. Please login again to get a new token.",
    "code": "INVALID_TOKEN",
    "timeStamp": "Wed Nov 26 2025 03:03:06 GMT+0700 (Western Indonesia Time)"
}
```
- Inavalid Duplicatee create
```json 
{
    "error": "duplicate key value violates unique constraint \"roles_table_pkey\"",
    "code": "23505",
    "timeStamp": "Wed Nov 26 2025 03:04:37 GMT+0700 (Western Indonesia Time)"
}
```