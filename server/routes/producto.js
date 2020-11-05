const express = require('express');
const { verificarToken, verificaAdminRole } = require('../middlewares/autenticacion');
const Producto = require('../models/producto');
const app = express();

//Obtener todos los productos
app.get('/productos', verificarToken, (req, res) => {
    const desde = Number(req.query.desde || 0);
    const hasta = Number(req.query.hasta || 10);
    Producto.find({ disponible: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .skip(desde)
        .limit(hasta)
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments({ disponible: true }, (err, conteo) => {
                return res.json({
                    ok: true,
                    productos,
                    total: conteo
                })
            })
        });
});

// Obtener producto por id
app.get('/productos/:id', verificarToken, (req, res) => {
    const id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(404).json({
                    ok: false,
                    err: {
                        mensaje: 'No se ha encontrado el producto.'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            })
        });
});

// buscar producto
app.get('/productos/buscar/:termino', verificarToken, (req, res) => {
    const termino = req.params.termino;
    const regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productos) {
                return res.status(404).json({
                    ok: false,
                    err: {
                        mensaje: 'No se encontraron coincidencias'
                    }
                });
            }

            res.json({
                ok: true,
                productos
            })
        })
});

// Crear un nuevo producto
app.post('/productos', [verificarToken, verificaAdminRole], (req, res) => {
    const body = req.body;

    const producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    })
});

// Actualizar produco
app.put('/productos/:id', [verificarToken, verificaAdminRole], (req, res) => {
    const id = req.params.id;
    const body = req.body;

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    mensaje: 'No se encontro el producto'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })
});

// Borrar producto
app.delete('/productos/:id', [verificarToken, verificaAdminRole], (req, res) => {
    const id = req.params.id;

    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(404).json({
                ok: false,
                err: {
                    mensaje: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    })
});


module.exports = app;