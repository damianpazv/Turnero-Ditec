import React, { useEffect } from 'react'
import './imprimirTurno.css'
import { useLocation } from 'react-router-dom';
const ImprimirTurno = () => {

    useEffect(() => {
        window.print();
      }, []);

      const location = useLocation();

      const searchParams = new URLSearchParams(location.search);
      const nombre = searchParams.get('nombre');
      const apellido = searchParams.get('apellido');
      const cuil = searchParams.get('cuil');
      const tramite = searchParams.get('tramite');
      const fecha = searchParams.get('dia');
      const hora = searchParams.get('hora');


      const formatFechaTurno = (fecha) => {
        // Convertir la fecha a un objeto de fecha en JavaScript
        const fechaIso = new Date(fecha);

        // Obtener el día, mes y año de la fecha
        const dia = fechaIso.getDate();
        const mes = fechaIso.getMonth() + 1; // Los meses comienzan desde 0, por lo que sumamos 1
        const año = fechaIso.getFullYear();

        // Formatear la fecha al formato "DD/MM/AAAA"
        const fechaFormateada = `${dia < 10 ? '0' : ''}${dia}/${mes < 10 ? '0' : ''}${mes}/${año}`;
        return fechaFormateada;

    }
console.log(nombre);
    return (
        <>
        {
            nombre != null &&
   <div>
   <div className='cont container-fluid w-100 d-md-none mt-5'>
       <div className='imprimir'>
           <h3>MUNICIPALIDAD DE SAN MIGUEL DE TUCUMAN</h3>
           <h5 className='mt-3 text-black'>TURNO CONFIRMADO</h5>

           <div className='datosCont mt-4'>
               <p>Tipo de Trámite: {tramite}</p>
               <div className='datos '>
                   <p>Día: {fecha?.length > 12 ? formatFechaTurno(fecha): fecha}</p>
                   <p>Hora: {hora}</p>
               </div>

               <p className='mt-4'>CUIL: {cuil}</p>
               <div className='datos'>
                   <p>Apellido: {apellido}</p>
                   <p>Nombre: {nombre}</p>
               </div>
           </div>
       </div>
   </div>
{/* ESTA DOS VECES PARA MANEJAR EL RESPONSIVE */}
   <div className='cont container-fluid w-50 d-none d-md-block mt-5'>
   <div className='imprimir'>
           <h3>MUNICIPALIDAD DE SAN MIGUEL DE TUCUMAN</h3>
           <h5 className='mt-3 text-black'>TURNO CONFIRMADO</h5>

           <div className='datosCont mt-4'>
               <p>Tipo de Trámite: {tramite}</p>
               <div className='datos '>
                   <p>Día: {fecha?.length > 10 ? formatFechaTurno(fecha): fecha}</p>
                   <p>Hora: {hora}</p>
               </div>

               <p className='mt-4'>CUIL: {cuil}</p>
               <div className='datos'>
                   <p>Apellido: {apellido}</p>
                   <p>Nombre: {nombre}</p>
               </div>
           </div>
       </div>
   </div>

</div>

        }
        </>
     
    )
}

export default ImprimirTurno