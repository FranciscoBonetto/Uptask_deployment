import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if(btnEliminar){
    btnEliminar.addEventListener('click', (e) =>{
        // console.log('Diste en eliminar');//para que este funcione y se muestre hay que llamarlo en el layout
        const urlProyecto = e.target.dataset.proyectoUrl;//Esto es para llamar a (data-proyecto-url) que se agrego en tarear.pug
        
        // console.log(urlProyecto);
        Swal.fire({
         title: '¿Estas seguro?',
         text: "El proyecto no se podra recuperar!",
         icon: 'warning',
         showCancelButton: true,
         confirmButtonColor: '#3085d6',
         cancelButtonColor: '#d33',
         confirmButtonText: 'Si, borrar!',
         cancelButtonText: 'Cancelar'
       }).then((result) => {
         if (result.isConfirmed) {
            //Enviar peticion a axios
            const url = `${location.origin}/proyectos/${urlProyecto}`;
            
            axios.delete(url,{params: {urlProyecto}})
                .then(function(respuesta){
                    console.log(respuesta)

                        Swal.fire(
                            'Eliminado!',
                            respuesta.data,
                            'success'
                        );
                    
                        //redireccionar al inicio
                        setTimeout(() => {
                                window.location.href = '/'
                        }, 3000)
                })
                .catch(() => {
                    Swal.fire({
                        type:'error',
                        title:'Hubo un error',
                        text : 'Nose pudo eliminar el proyecto'
                    })
                })
         }
       })
    })
}

export default btnEliminar;