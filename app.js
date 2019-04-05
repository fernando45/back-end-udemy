// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// Inicializar variables.
var app = express();

// Body parser.

// aplicación parse / x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Conexion a la base de datos.

//const uri = "mongodb+srv://fernando:Matrix-45@cluster0-69mcn.mongodb.net/test?retryWrites=true";

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    //mongoose.connection.openUri(uri, (err, res) => {
    if (err) throw err;
    console.log(' Base de datos online: \x1b[32m%s\x1b[0m', 'online');

});

// Importar rutas.

var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


// Escuchar peticiones-
app.listen(3000, () => {
    console.log(' server corriendo en puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});