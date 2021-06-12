//Importal modelo para la BD, para crear un nuevo registro
const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.agregarTarea = async(req,res,next) => {
    //Obtenemos el proyecto
    const proyecto = await Proyectos.findOne({
        where: {
            url: req.params.url 
        }
    });

    // console.log(proyecto);
    // console.log(req.body);
    //Leer el valor del input
    const {tarea} = req.body;

    const estado = 0;
    const proyectoId =  proyecto.id;

    //Insertar en la BD
    const resultado = await Tareas.create({tarea, estado, proyectoId});

    if(!resultado)
    {
        return next();
    }
    //Redireccionar
    res.redirect(`/proyectos/${req.params.url }`);
}

exports.cambiarEstadoTarea = async (req,res,next) => {
    const {id} = req.params;
    const tarea = await Tareas.findOne({
        where: {
            id//Se pone asi cuando es por ej id: id. Se llaman igual
        }
    })
    
    //cambiar estado
    let estado = 0;

    if (tarea.estado === estado){
        estado = 1;
    }
    tarea.estado = estado;

    const resultado = await tarea.save();//Solo lo va a guardar en la BD

    if(!resultado) return next();
 
    res.status(200).send('Actualizado wachin...');

}

exports.eliminarTarea = async (req,res,next) => {
    const {id} = req.params;

    //Eliminar tarea
    const resultado = await Tareas.destroy({where: { 
        id
    }});

    if(!resultado) return next();  

    res.status(200).send('Tarea eliminada correctamente.');
}