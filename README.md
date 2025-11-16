
<div align="center">
    <img width="380" src="https://i.pinimg.com/originals/62/ea/8c/62ea8c38b07063cac2c47be11e03c361.gif" />
</div>
<br/>

<div align="center">
    <h1 > Documentation API SIMJUR </h1>
    <p >Created By : Power Ranger</p>
</div>


# Anggota Tim :

<div align="center">

| ![Avatar 1](https://i.pinimg.com/736x/84/19/28/8419285e09006fae7beb3be72f562a87.jpg) | ![Avatar 2](https://i.pinimg.com/736x/84/19/28/8419285e09006fae7beb3be72f562a87.jpg) | ![Avatar 3](https://i.pinimg.com/736x/84/19/28/8419285e09006fae7beb3be72f562a87.jpg) | ![Avatar 4](https://i.pinimg.com/736x/84/19/28/8419285e09006fae7beb3be72f562a87.jpg) | ![Avatar 5](https://i.pinimg.com/736x/84/19/28/8419285e09006fae7beb3be72f562a87.jpg) |
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
    "message": "OTP berhasil dikirim!"
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
>ketika value **name** dan **nomor telepon** terisi dan di submit, maka OTP terkirim kepada user.
<br/>