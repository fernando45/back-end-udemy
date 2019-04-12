var express = require('express');
var app = express();

var Medico = require('../models/medico');
var mdAutenticacion = require('../middlewares/autenticacion');

var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// ==============================================
// Obtener todos los medicos.
// ==============================================
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({}, 'nombre usuario hospital')
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .skip(desde)
        .limit(5)
        .exec(

            (err, medicos) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error cargando medico',
                        errors: err
                    });
                }

                Medico.count({}, (error, conteo) => {

                    res.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: conteo
                    });

                });

            });


});

// ==============================================
// Actualizar un medico.
// ==============================================

app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'el medico el id' + id + 'no existe',
                errors: { mensaje: 'No existe un medico con este id' }
            });
        }
        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }

        medico.nombre = body.nombre;
        medico.hospital = body.hospital;
        medico.usuario = req.usuario._id;

        medico.save((err, medicoGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error al guardar medico',
                    errors: err
                });
            }


            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });

        });

    });

});

// ==============================================
// Crear un medico
// ==============================================

app.post('/', (req, res) => {
    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        hospital: body.hospital,
        usuario: req.usuario._id

    });

    medico.save((err, medicoGuardado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado,
            usuariotoken: req.usuario
        });

    });
});

// ==============================================
// borrar un hospital por el id
// ==============================================

app.delete('/:id', (req, res) => {
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un medico con este id',
                errors: { message: 'No existe un  medico con este id' }
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });

    });

});


module.exports = app;