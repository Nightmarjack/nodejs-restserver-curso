const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', (req, res) => {
    const tipo = req.params.tipo;
    const id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                mensaje: 'No se han subido archivos'
            }
        });
    }

    // Validar tipos
    const tiposValidos = ['productos', 'usuarios'];
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            err: {
                mensaje: `Tipo no válido. Los tipos válidos son: ${tiposValidos.join(',')}.`,
                tipo
            }
        });
    }

    let archivo = req.files.archivo;
    // Validar extenciones permitidas
    let extencion = archivo.name.split('.').pop();
    let extencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (!extencionesValidas.includes(extencion)) {
        return res.status(404).json({
            ok: false,
            err: {
                mensaje: `Archivo no permitido. Las extenciones validas son: ${extencionesValidas.join(',')}.`,
                ext: extencion
            }
        })
    }

    // Cambiar el nombre del archivo
    const nombreArchivo = `${id}-${new Date().getMilliseconds()}-${archivo.name}`;

    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }
    });

});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(404).json({
                ok: false,
                err: {
                    mensaje: 'El usuario no existe'
                }
            });
        }

        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioActualizado) => {
            res.json({
                ok: true,
                usuario: usuarioActualizado,
                img: nombreArchivo
            });
        });
    });
}

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(404).json({
                ok: false,
                err: {
                    mensaje: 'El producto no existe'
                }
            });
        }

        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoActualizado) => {
            res.json({
                ok: true,
                producto: productoActualizado
            });
        });
    });
}

function borraArchivo(nombreImagen, tipo) {
    const pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    if (fs.existsSync(pathImagen)) { fs.unlinkSync(pathImagen); }
}

module.exports = app;