var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var mdAutenticacion = require('../middlewares/autenticacion');


// ==============================================
// Obtener todos los hospitales.
// ==============================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(5)
        .exec(

            (err, hospitales) => {

                if (err) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error cargando hospital',
                        errors: err
                    });
                }

                Hospital.count({}, (error, conteo) => {

                    res.status(200).json({
                        ok: true,
                        hospitales: hospitales,
                        total: conteo
                    });

                });
            });
});

// ==============================================
// Actualizar un hospital.
// ==============================================

app.put('/:id', (req, res) => {
    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'el hospitalcon el id' + id + 'no existe',
                errors: { mensaje: 'No existe un hospiutal con este id' }
            });
        }
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'error al guardar hospital',
                    errors: err
                });
            }


            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });

        });

    });

});

// ==============================================
// Crear un hospital
// ==============================================

app.post('/', mdAutenticacion.verificaToken, (req, res) => {
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id

    });

    hospital.save((err, hospitalGuardado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado,

        });

    });
});

// ==============================================
// borrar un hospital por el id
// ==============================================

app.delete('/:id', (req, res) => {
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hopital con este id',
                errors: { message: 'No existe un hospital con este id' }
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });

    });

});




module.exports = app;