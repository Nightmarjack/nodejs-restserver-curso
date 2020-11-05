const express = require('express');
const { verificarToken, verificaAdminRole } = require('../middlewares/autenticacion');
const app = express();
const Categoria = require('../models/categoria');
const _ = require('underscore');

// Mostrar todas las categorias
app.get('/categoria', verificarToken, (req, res) => {
    Categoria.find({ estado: true })
    .sort('nombre')
    .populate('usuario', 'nombre email')
    .exec((err, categorias) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        Categoria.countDocuments({estado: true}, (err, conteo) => {
            res.json({
                ok: true,
                categorias,
                total: conteo
            });
        });
    });
});

// Mostrar una categoria por ID
app.get('/categoria/:id', verificarToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.json({
                ok: false,
                err: {
                    mensaje: 'La categoria no existe.'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })
});

// Crear nueva categoria
app.post('/categoria', verificarToken, (req, res) => {
    let body = req.body;
    let categoria = new Categoria({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// Actualizar una categoria
app.put('/categoria/:id', verificarToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'img', 'estado']);
    body.ultimoUsuarioModifico = req.usuario._id;

    Categoria.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })
});

// Borrar una categoria
app.delete('/categoria/:id', [verificarToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, categoriaBorrada) => {
        if (err) {
            return res.json({
                ok: false,
                err
            });
        }
        
        if (!categoriaBorrada) {
            return res.json({
                ok: false,
                err: {
                    mensaje: "La categoria no existe."
                }
            });
        }

        res.json({
            ok: true,
            mensaje: 'Categoria borrada',
            categoria: categoriaBorrada
        });
    });
});

module.exports = app;