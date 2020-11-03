//=======================
// Puerto
//=======================
process.env.PORT = process.env.PORT || 3000;

//=======================
// Puerto
//=======================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=======================
// Puerto
//=======================
let urlDB;

//=======================
// Vencimiento del Token
//=======================

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//=======================
// SEED del token
//=======================

process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrollo';


if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;
