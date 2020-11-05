const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Usuario = require('./usuario');

let Schema = mongoose.Schema;
let categoriaSchema = new Schema({
    nombre: {
        type: String,
        unique: true,
        required: [true, 'Nombre de categoria es requerido']
    },
    usuario: {
        type: String,
        required: [true, 'El usuario que registró la categoria es requerido'],
        ref: Usuario
    },
    ultimoUsuarioModifico: {
        type: String,
        default: '',
        ref: Usuario
    },
    img: {
        type: String,
        required: [true, 'Imagen de la categoria es requerido']
    },
    estado: {
        type: Boolean,
        default: true
    }
});

categoriaSchema.plugin(uniqueValidator, {message: '{PATH} debe ser unico'});

module.exports = mongoose.model('Categoria', categoriaSchema);

