import axios from "axios";
import Swal from 'sweetalert2';
import {actualizarAvance} from '../funciones/avance';


const tareas = document.querySelector('.listado-pendientes');

if (tareas) {
    tareas.addEventListener('click', e => {
        //console.log(e.target.classList);
        if(e.target.classList.contains('fa-check-circle')){
            //console.log('Actualizando');//Extraer id de la tarea
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            //request hacia /tareas/:id
            const url = `${location.origin}/tareas/${idTarea}`;

            axios.patch(url, {idTarea})
                .then(function (respuesta){
                    //console.log(respuesta);
                    if(respuesta.status === 200){
                        icono.classList.toggle('completo');

                        actualizarAvance();
                    }
                })
        }
        if(e.target.classList.contains('fa-trash')){
            // console.log(e.target.parentElement.parentElement);

            const tareaHtml = e.target.parentElement.parentElement;
            const idTarea = tareaHtml.dataset.tarea;

            Swal.fire({
                title: '¿Estas seguro?',
                text: "La tarea no se podra recuperar!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, borrar!',
                cancelButtonText: 'Cancelar'
              }).then((result) => {
                if (result.isConfirmed) {
                    const url = `${location.origin}/tareas/${idTarea}`;

                   //enviar el delete por medio de axios
                   axios.delete(url, { params: { idTarea}})
                        .then(function(respuesta){
                            if(respuesta.status === 200){
                                tareaHtml.parentElement.removeChild(tareaHtml);//Nos tenemos que ir al padre

                                //Opcional una alerta
                                Swal.fire(
                                    'Tarea Eliminada',
                                    respuesta.data,
                                    'success'
                                )
                                actualizarAvance();
                            }
                        }); 
                }
              })
        }
    });
}

export default tareas;