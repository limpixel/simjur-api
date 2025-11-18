
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




# Daftar Pustaka : 
- [Anggota Tim :](#anggota-tim-)
- [Daftar Pustaka :](#daftar-pustaka-)
- [Installasi :](#installasi-)
- [API Testing](#api-testing)
- [Regiser - POST](#regiser---post)
    - [**Success \[200\]** ](#success-200-)
    - [Error Duplicate - 500](#error-duplicate---500)
- [Login](#login)
    - [Success - Has Been Login](#success---has-been-login)

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
| name [ Text ]  | Danu         |
| roles_id [ Text ] | 1 |
| description [ Text ] | admin user |
| password [ Text ] | 12345678 |

**output** : 
```JSON
{
    "code": "success",
    "message": "Account has been registerd"
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
