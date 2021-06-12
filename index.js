const express = require('express');
const rutes = require('./routes')
const path = require('path');//libreria que ya existe en node
const bodyParser = require('body-parser');//Primero agregamos la libreria que ya es parte de express
const expressValidator = require('express-validator');
const flash = require('connect-flash');
//helpers con algunas funciones
const helpers = require('./helpers');
const sessions = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
//extraer valores de variables.env
require('dotenv').config({ path: 'variables.env'})

//Para crear la coneccion a la base no requiere de express asi que puede ir en cualquier lado aca
const db = require('./config/db');

//Importar modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

//db.authenticate()
db.sync()
    .then(() => console.log('Conectado al servidor'))
    .catch(error => console.log(error));



//crear una app express
const app = express();

//Donde cargar los archivos estaticos
app.use(express.static('public'));

//Habilitar pug
app.set('view engine', 'pug');

//Habilitar bodyParser para leer datos del formulario
//app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({ extended: true }));

//Agregamos express validator a toda la aplicacion
//app.use(expressValidator());



//Añadir la carpeta de la vistas
app.set('views', path.join(__dirname, './views'));

//Agregar flash messages
app.use(flash());

app.use(cookieParser());

//Sessiones
app.use(sessions({
    secret: 'supersecreto',//Firma la cookie
    resave: false,
    saveUninitialized: false//Estos dos mantenie la seccion activa
}))

//Passport
app.use(passport.initialize());
app.use(passport.session());

//Helpers. Pasar var dump a la Aplicacion
app.use((req, res, next) => {
    res.locals.year = 2021;
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
});

//Aprendiendo Middleware
// app.use((req, res, next) =>{
//     console.log('Yo soy este M');
//     next();
// });



app.use('/',rutes());

//app.listen(5000); // Puerto

// require('./handlers/email'); //Esto es para que llegue a la pagina de mailtrap de ejemplo

//Servidor y puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 5000;

app.listen(port, host, () => {
    console.log('El servidor esta funcionando');
});