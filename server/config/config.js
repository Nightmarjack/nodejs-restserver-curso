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

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = 'mongodb+srv://udemyMongo:Fallen2902.@cluster0.kr4fi.mongodb.net/cafe'
}

process.env.URLDB = urlDB;
