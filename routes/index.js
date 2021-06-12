const express = require('express');
const router = express.Router();
const Tareas = require('../models/Tareas');

//Importamos express validator
const { body } = require('express-validator');

//importamos el controlador
const proyectosController = require('../controllers/proyectosController');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = function(){
    //ruta para el home
    router.get('/', 
        authController.usuariosAutenticado, //Aca agregamos lo de authController para revisar si esta autenticado
        proyectosController.proyectosHome
    );

    router.get('/nuevo-proyecto', 
        authController.usuariosAutenticado, //Aca agregamos lo de authController para revisar si esta autenticado
        proyectosController.formularioProyecto
    );

    router.post('/nuevo-proyecto',
        authController.usuariosAutenticado,
        body('nombre').not().isEmpty().trim().escape(),//Asi revisamos que no este vacio. El trim es para que elimine los campos vacios. El escape es para eliminar los demas signos
        proyectosController.nuevoProyecto
    );

    // Listar Proyecto
    router.get('/proyectos/:url', 
        authController.usuariosAutenticado,
        proyectosController.proyectoPorUrl
    );

    //Actualizar el Proyecto
    router.get('/proyecto/editar/:id', 
        authController.usuariosAutenticado,
        proyectosController.formularioEditar
    );
    router.post('/nuevo-proyecto/:id',
        authController.usuariosAutenticado, 
        body('nombre').not().isEmpty().trim().escape(),//Asi revisamos que no este vacio. El trim es para que elimine los campos vacios. El escape es para eliminar los demas signos
        proyectosController.actualizarProyecto
    );

    //Eliminar el Pryecto
    router.delete('/proyectos/:url',authController.usuariosAutenticado, proyectosController.eliminarProyecto);
    
    //Tareas
    router.post('/proyectos/:url',authController.usuariosAutenticado, tareasController.agregarTarea)
    
    //Actualizar Tareas
    router.patch('/tareas/:id',authController.usuariosAutenticado, tareasController.cambiarEstadoTarea);//Al poner esta direccion aca, en tareas.js tenemos que cambiar la direccion
    
    //Eliminar Tareas
    router.delete('/tareas/:id',authController.usuariosAutenticado, tareasController.eliminarTarea);

    //Crear nueva cuenta
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta);

    //Iniciar Session
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    //Cerrar Session
    router.get('/cerrar-sesion', authController.cerrarSesion);

    //Ir al inicio del proyecto
    router.get('/inicio-proyecto', authController.inicioProyecto);

    //restablecer contraseña
    router.get('/reestablecer', usuariosController.formRestablecerPassword);
    router.post('/reestablecer', authController.enviarToken);
    router.get('/reestablecer/:token', authController.validarToken);

    router.post('/reestablecer/:token', authController.actualizarPassword);
    return router; 
}