import React, { useEffect } from 'react'
import './imprimirTurno.css'
import { useLocation } from 'react-router-dom';
const ImprimirTurno = () => {

    useEffect(() => {
        window.print();
      }, []);

      const location = useLocation();
      const datos = location.state;

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
    return (
        <div>
            <div className='cont container-fluid w-100 d-md-none mt-5'>
                <div className='imprimir'>
                    <h3>MUNICIPALIDAD DE SAN MIGUEL DE TUCUMAN</h3>
                    <h5 className='mt-3 text-black'>TURNO CONFIRMADO</h5>

                    <div className='datosCont mt-4'>
                        <p>Tipo de Trámite: {datos.tramite.nombre_tramite}</p>
                        <div className='datos '>
                            <p>Día: {datos.values.fecha ? datos.values.fecha : formatFechaTurno(datos.values.fechaAnularTurno)}</p>
                            <p>Hora: {datos.values.hora}</p>
                        </div>

                        <p className='mt-4'>CUIL: {datos.user.documento_persona}</p>
                        <div className='datos'>
                            <p>Apellido: {datos.user.apellido_persona}</p>
                            <p>Nombre: {datos.user.nombre_persona}</p>
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
                        <p>Tipo de Trámite: {datos.tramite.nombre_tramite}</p>
                        <div className='datos '>
                            <p>Día: {datos.values.fecha?  datos.values.fecha : formatFechaTurno(datos.values.fechaAnularTurno)}</p>
                            <p>Hora: {datos.values.hora}</p>
                        </div>

                        <p className='mt-4'>CUIL: {datos.user.documento_persona}</p>
                        <div className='datos'>
                            <p>Apellido: {datos.user.apellido_persona}</p>
                            <p>Nombre: {datos.user.nombre_persona}</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ImprimirTurno