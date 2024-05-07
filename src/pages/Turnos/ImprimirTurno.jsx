import React, { useEffect, useState } from 'react'
import './imprimirTurno.css'
import { Link, Navigate, useLocation } from 'react-router-dom';
import axios from '../../config/axios';
import { Box, CircularProgress } from '@mui/material';

const ImprimirTurno = () => {

    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    // const nombre = searchParams.get('nombre');
    // const apellido = searchParams.get('apellido');
    const cuil = searchParams.get('cuil');
    const tramite = searchParams.get('tramite');
    // const fecha = searchParams.get('dia');
    // const hora = searchParams.get('hora');
    const id_tramite = searchParams.get('id_tramite');

    const [turnoValido, setTurnoValido] = useState(undefined)
    const [values, setValues] = useState("")

    const consultarTurno = async () =>{
        try {
            const resultado = await axios.get(`/turnos/existeTurno?cuil=${cuil}&id_tramite=${id_tramite}`);
            if(resultado.data.length > 0 && resultado.data[0][0] != 0){
                setValues(resultado.data[0]);
                setTurnoValido(true);
            }else setTurnoValido(false);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
    consultarTurno();
    }, [])
    

    useEffect(() => {
       
        if(turnoValido){
            window.print();
        }
      }, [turnoValido]);


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
        <>
            {
                turnoValido ?
                    <div>
                        <div className='cont container-fluid w-100 d-md-none mt-5'>
                            <div className='imprimir'>
                                <h3>MUNICIPALIDAD DE SAN MIGUEL DE TUCUMAN</h3>
                                <h5 className='mt-3 text-black'>TURNO CONFIRMADO</h5>

                                <div className='datosCont mt-4'>
                                    <p>Tipo de Trámite: {tramite}</p>
                                    <div className='datos '>
                                        <p>Día: {values?.dia_turno.length > 12 ? formatFechaTurno(values?.dia_turno) : values?.dia_turno}</p>
                                        <p>Hora: {values?.hora_turno}</p>
                                    </div>

                                    <p className='mt-4'>CUIL: {values.dni}</p>
                                    <div className='datos'>
                                        <p>Apellido: {values?.apellido}</p>
                                        <p>Nombre: {values?.nombre}</p>
                                    </div>
                                </div>

                            </div>
                            <div className='texto-justificado'>
                                <small className='notaAlPieComprobante'>Nota: El presente comprobante cumple solo una función de recordatorio para el causante, el mismo es intransferible y carece de validez para reclamos futuros. El causante solo podrá acceder al turno si se encuentra registrado en nuestra base de datos.</small>
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
                                        <p>Día: {values?.dia_turno.length > 12 ? formatFechaTurno(values?.dia_turno) : values?.dia_turno}</p>
                                        <p>Hora: {values?.hora_turno}</p>
                                    </div>

                                    <p className='mt-4'>CUIL: {values.dni}</p>
                                    <div className='datos'>
                                        <p>Apellido: {values?.apellido}</p>
                                        <p>Nombre: {values?.nombre}</p>
                                    </div>
                                </div>


                            </div>
                            <div className='texto-justificado'>
                                <small className='notaAlPieComprobante'>Nota: El presente comprobante cumple solo una función de recordatorio para el causante, el mismo es intransferible y carece de validez para reclamos futuros. El causante solo podrá acceder al turno si se encuentra registrado en nuestra base de datos.</small>
                            </div>
                        </div>

                    </div>
                    : turnoValido == undefined ?

                        <Box className="d-flex justify-content-center mt-5">
                            <CircularProgress />
                        </Box>

                        : !turnoValido && <Navigate to="/turnos" />
            }
        </>
     
    )
}

export default ImprimirTurno