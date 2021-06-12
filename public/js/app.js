import proyectos from './modulos/proyectos';
import tareas from './modulos/tareas';

import {actualizarAvance} from './funciones/avance';

document.addEventListener('DOMContentLoaded', () => {
    actualizarAvance();//Llamo a la funcion de avance.js para que se pinde la barra
})