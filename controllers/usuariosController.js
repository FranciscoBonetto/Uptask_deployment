const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta  = async(req, res, next) => {
    res.render('crearCuenta', {
        nombrePagina : 'Crear cuenta'
    })

}

exports.formIniciarSesion  = async(req, res, next) => {
    const { error} = res.locals.mensajes;
    res.render('iniciarSesion', { 
        nombrePagina : 'Iniciar Sesion',
        error
    })

}

exports.crearCuenta = async (req, res, next) => {
    //leer los datos
    const { email, password} = req.body;

    try {
        //crear el usuario
        await  Usuarios.create({
            email, 
            password
        });

        //crear una URL de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        //crear el objeto de usuario
        const usuario = {
            email
        }

        //enviar email
        await enviarEmail.enviar({//Se puede usar esta misma funcion en otro archivo
            usuario,
            subject: 'Confirma tu cuenta UpTask',
            confirmarUrl,
            archivo : 'confirmar-cuenta'
        });

        //redirigir al usuario
        req.flash('correcto', 'Enviamos un correo, confirma tu cuenta');
        res.redirect('/iniciar-sesion');
    } catch (error){
        req.flash('error', error.errors.map(error => error.message));//Todos los errores lo va a agrupar aca //Lo llamo en el index debajo del dump
        res.render('crearCuenta', {
            mensajes: req.flash() ,
            nombrePagina: 'Crear cuenta',
            email : email,
            password
        })
    }

    
   
    // .then(() => {
        //Se usa cuando no tenos un async await
    // })
}

exports.formRestablecerPassword =  (req,res, next) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu contraseña'
    });
}

//cambia el estado de una cuenta
exports.confirmarCuenta = async (req,res) => {
    // res.json(req.params.correo);
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    //si no existe el usuario
    if(!usuario){
        req.flash('error', 'No Valido');
        res.redirect('/crear-cuenta');
    } 

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');
}