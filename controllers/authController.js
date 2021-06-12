const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const crypto = require('crypto');//Nos va a permitir generar un Token
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');


exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos compos son obligatorios'
});

//Funcion para revisar si el usuario esta logueado o no
exports.usuariosAutenticado = (req, res, next) => {
    
    //si el usuari esta autenticado, adelnate
    if(req.isAuthenticated()){
        return next();
    }

    //sino, rederigir al formulario
    return res.redirect('/iniciar-sesion');
}
//Funcion para cerrar sesion
exports.cerrarSesion = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion'); //Al cerrar sesion nos lleva a la pantalla de inciar sesion
    })
}

exports.inicioProyecto = (req, res) => {
    res.redirect('/');
}

//Genera un token si el usuario es valido
exports.enviarToken = async (req,res) => {
    //verificar que el usuario exista
    const usuario = await Usuarios.findOne({ where: { email: req.body.email}});

    //Si no existe
    if(!usuario){
        req.flash('error', 'No existe esa cuenta');
        // res.render('reestablecer', {
        //     nombrePagina: 'Reestablecer tu contraseña',
        //     mensajes: req.flash()
        // })
        res.redirect('/reestablecer');
    }

    //Si el usuario existe
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000; //1 Hora

    //Guardarlos en la BD
    await usuario.save();

    // url de reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    //console.log(resetUrl);
    //envia el correo con el token
    await enviarEmail.enviar({//Se puede usar esta misma funcion en otro archivo
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo : 'reestablecer-password'
    });

    //terminar la ejecucion
    req.flash('correcto', 'Se envió un mensaje a tu correo.');
    res.redirect('iniciar-sesion');

}

exports.validarToken = async (req,res) => {
    const usuario = await Usuarios.findOne({
        where: { 
            token: req.params.token
        }
    });

    //sino encuentra el usuario
    if(!usuario){
        req.flash('error', 'No Válido');
        res.redirect('/reestablecer');
    }
    
    //Formulario para generar el password
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer Contraseña'
    })
}

//Cambia el Password por uno nuevo
exports.actualizarPassword = async (req,res) => {

    //Cerifica el token valido pero tambien la fecha de expiracion
    const usuario = await Usuarios.findOne({ 
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });

    //verificamos si el usuario existe
    if(!usuario){
        req.flash('error', 'No Válido');
        res.redirect('/reestablecer');
    }

    //hashear el password

    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;
    
    //Guardamos el nuevo password
    await usuario.save();

    req.flash('correcto', 'Tu password se modificado correctamente.');
    res.redirect('/iniciar-sesion');
}