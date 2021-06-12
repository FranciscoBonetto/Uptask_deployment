//Importal modelo para la BD, para crear un nuevo registro
const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.proyectosHome = async (req, res) => {
    //console.log(res.locals.usuario);
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId}});//Si quieres mostrar todos los proyectos (Es como pones Select * from proyectos)
    
    //res.send('Index'); 
    res.render('index',{
        nombrePagina : 'Proyectos ' + res.locals.year,
        proyectos
    });
}

exports.formularioProyecto = async (req, res) => {
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId}});

    res.render('nuevoProyecto',{
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
}

exports.nuevoProyecto = async (req, res) => {
   // res.send('Enviaste el formulario')
   //enviar a la consola lo que el usuario escriba
   //console.log(req.body);
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId}});
   
   //validar que tengamos algo en el input
   const { nombre } = req.body;

   let errores = [];

   if (!nombre){ 
       errores.push({'texto': 'Falta el nombre del proyecto.'})
   }

   //si hay errores
   if(errores.length > 0){
        res.render('nuevoProyecto', {
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        })
   }
   else{
       //No hay errores
       //Insertar en la BD
       const usuarioId = res.locals.usuario.id;
       const proyecto = await Proyectos.create({ nombre, usuarioId});//Estos son los nombres de los compos de la BD
       res.redirect('/');//Una vez que se inserte que me lleve al Inicio

   }

}

exports.proyectoPorUrl = async(req, res, next) => {
    //res.send('Listo');
    //res.send(req.params.url);
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId}});//Cuando uno no depende de la otra de aconseja usar Promise.All() como en formularioEditar

    const proyecto = await Proyectos.findOne({ 
         where: {
            url: req.params.url,
            usuarioId
         }
    });

    //Consultar tareas del proyecto actual

    const tareas = await Tareas.findAll({
        where: {
            proyectoId : proyecto.id
        },
        include: [
            { model: Proyectos }
        ]
    });

    // console.log(tareas);


    if(!proyecto) return next();

    // console.log(proyecto);
    // res.send('OK');

    //render a la vista
    res.render('tareas', {
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    })
}

exports.formularioEditar = async (req, res, next) => {
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: { usuarioId}});

    const proyectoPromise = Proyectos.findOne({ 
        where: {
           id: req.params.id,
           usuarioId
        }
   });

   const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise]);

//     next();

    //render a la vista
    res.render('nuevoProyecto', {
        nombrePagina: 'Editar Proyecto - ' + proyecto.nombre,
        proyectos,
        proyecto
    })
}

exports.actualizarProyecto = async (req, res) => {
    // res.send('Enviaste el formulario')
    //enviar a la consola lo que el usuario escriba
    //console.log(req.body);
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId}});
    
    //validar que tengamos algo en el input
    const { nombre } = req.body;
 
    let errores = [];
 
    if (!nombre){ 
        errores.push({'texto': 'Falta el nombre del proyecto.'})
    }
 
    //si hay errores
    if(errores.length > 0){
         res.render('nuevoProyecto', {
             nombrePagina: 'Nuevo Proyecto',
             errores,
             proyectos
         })
    }
    else{
        //No hay errores
        //Insertar en la BD
        await Proyectos.update(
            { nombre: nombre},
            { where: { id: req.params.id }}
        );
        res.redirect('/');//Una vez que se inserte que me lleve al Inicio
 
    }
 
}

exports.eliminarProyecto = async(req, res, next) => {

    // console.log(req.query);
    const { urlProyecto} = req.query;

    const resultado = await Proyectos.destroy({where: { 
        url : urlProyecto
    }});

    res.status(200).send('Proyecto eliminado');
}