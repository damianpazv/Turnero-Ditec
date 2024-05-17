import { Alert, Box, Button, CircularProgress, InputLabel, MenuItem, Select, Skeleton, Snackbar, TextField, TextareaAutosize } from '@mui/material';
import React, { useEffect, useState } from 'react'
import axios from '../../config/axios';
import useStore from '../../Zustand/Zustand';
import "./Turnos.css"
import DatePickerComponent from './Fechas';
import ConfirmarTurnoModal from './ConfirmarTurnoModal';
import AnularTurnoModal from './AnularTurnoModal';
import ObservacionesTramitesTextArea from './ObservacionesTramite';
import { useNavigate } from 'react-router-dom';
import CampoAdicionalTurno from './CampoAdicionalTurno';
import { formatFecha } from '../../utils/mostrarFecha';

const Turnos = () => {

  const { user, authenticated, loading, logout } = useStore();
  const navigate = useNavigate()

  const [tramites, setTramites] = useState([])
  const [turnosPorDia, setTurnosPorDia] = useState([]);
  const [turnosPorHora, setTurnosPorHora] = useState([]);
  const [botonState, setBotonState] = useState(false)
  const [cambiarTurnoNoti, setcambiarTurnoNoti] = useState(false);

  const [notificacion, setNotificacion] = useState({ mensaje: "", tipo: "" });

  const [fechasHabilitadas, setFechasHabilitadas] = useState([]);

  const [values, setValues] = useState({ cuil: "", descripcion: "", tramite: "", fecha: "", hora: "", adicional:"" });

  const [tramiteSelected, setTramiteSelected] = useState("")
  const handleChangeSelect = (e) => {

    setTramiteSelected(tramites.find(t=>t.idtramite == e.target.value))
    setValues({ ...values, [e.target.name]: e.target.value, fecha: "" });
  };

  const [open, setOpen] = useState(false);
  const [openAnularTurno, setOpenAnularTurno] = useState(false);

  const handleChangeSelectHora = (e) => {

    setValues({ ...values, [e.target.name]: e.target.value });
  
    setOpen(true)
  }

  const handleChange = (e) =>{
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  const handleLogout = () => {
    logout();
  };
  
  const obtenerTramites = async () => {
    try {
      const { data } = await axios.get(`/turnos/listarTramites?reparticion_id=${localStorage.getItem("reparticion")}`)
  
      setTramites(data.tramites)
    } catch (error) {
      console.log(error);
      if(error?.response?.status== 401){
        handleLogout();
      }
    }
  }

  useEffect(() => {
    obtenerTramites();
  }, [])

  const [bandera, setBandera] = useState(false)

  const getDataExisteTurno = async (e) => {
    e.preventDefault();
    if (values.tramite != "") {
      setBandera(true);
      try {
        const resultado = await axios.get(`/turnos/existeTurno?cuil=${user.documento_persona}&id_tramite=${values.tramite}`);

        if (resultado.data.length > 0 && resultado.data[0][0] != 0) {
          console.log("ya tengo turno");
          setValues({ ...values, [e.target.name]: e.target.value, hora: resultado.data[0].hora_turno, fechaAnularTurno: resultado.data[0].dia_turno });
          setOpenAnularTurno(true);
          setBandera(false);
        } else {

          obtenerTurnosPorDia()

        }

      } catch (error) {
        console.log("mal");
        // console.log(error.response.status);
        setNotificacion({ mensaje: error.response.data?.message || error.message, tipo: "error" });
        if(error?.response?.status== 401){
          handleLogout();
        }
      }
    } else {
      setNotificacion({ mensaje: "Debe seleccionar un trámite", tipo: "error" });
    }

  };


  const obtenerTurnosPorDia = async () => {

    try {
      const resultado = await axios.get(`/turnos/buscarTurnosDisponiblesPorDia?id_tramite=${values.tramite}`);
  
      setTurnosPorDia(resultado.data)

      if (resultado.data.length == 0) {
        setNotificacion({ mensaje: "El trámite ingresado no tiene turnos disponibles", tipo: "error" });
        setcambiarTurnoNoti(false);
        setBandera(false);
        return;
      }
      const fechasOrdenadas = resultado.data.map(fecha => new Date(fecha.dia_turno));

      const fechaMinima = new Date(Math.min(...fechasOrdenadas));
      const fechaMaxima = new Date(Math.max(...fechasOrdenadas));

      const minDate = fechaMinima.toISOString().split('T')[0];
      const maxDate = fechaMaxima.toISOString().split('T')[0];

      setValues({ ...values, fecha: minDate })
      obtenerTurnosPorHora(minDate)

      const fechasConFormatoCorrecto = resultado.data.map(item => item.dia_turno.split('T')[0]);

      const fechasHabilitadas = ["2024-04-27", "2024-04-28"];
      setFechasHabilitadas(fechasConFormatoCorrecto);

    } catch (error) {
      console.log(error);
      console.log("mal");
      if(error?.response?.status== 401){
        handleLogout();
      }
    }

  };

  const obtenerTurnosPorHora = async (fecha) => {

    try {
      const resultado = await axios.get(`/turnos/buscarTurnosDisponiblesPorHora?id_tramite=${values.tramite}&fecha_solicitada=${fecha}`);

      setTurnosPorHora(resultado.data);
      if (resultado.data.length == 0) {
        setNotificacion({ mensaje: "No hay turnos disponibles para la fecha ingresada", tipo: "error" });
        setcambiarTurnoNoti(false);
        setBandera(false);
        return;
      }

    } catch (error) {
      console.log(error);
      if(error?.response?.status== 401){
        handleLogout();
      }
    }
    setBandera(false);
  }

  const handleInputChange = (value) => {
    if (value != "") {
      setBandera(true)
      setTurnosPorHora([])
      obtenerTurnosPorHora(value);
    }

  };

  const handleCloseSnackbar = () => {
    setNotificacion({ mensaje: "", tipo: "" });
  };

  const [operacionExitosa, setOperacionExitosa] = useState(undefined);

  const confirmarTurno = async () => {
    try {
      setBotonState(true);
      const { data } = await axios.post("/turnos/confirmarTurno", { cuil: user.documento_persona, id_tramite: values.tramite, apellido: user.apellido_persona, nombre: user.nombre_persona, fecha_solicitada: values.fecha, hora_solicitada: values.hora, email: user.email_persona, nombre_tramite: tramiteSelected.nombre_tramite, adicional: values.adicional });
    
      if (Object.values(data)[0] == 0) {
            if(cambiarTurnoNoti){
            setNotificacion({ mensaje: "El turno ya no esta disponible.. Seleccione otra fecha/hora.\nSu turno anterior sigue vigente", tipo: "error" });
            setcambiarTurnoNoti(false);
            }else{
              setNotificacion({ mensaje: "El turno ya no esta disponible.. Seleccione otra fecha/hora", tipo: "error" });
            }
      } else {

        setOperacionExitosa(Object.values(data)[0]);
        setNotificacion({ mensaje: "Turno Confirmado.\nLe enviamos un email con la información del turno.", tipo: "success" });
        setValues({ ...values, adicional:"" });
      }
    } catch (error) {
      console.log(error);
      if(error?.response?.status== 401){
        handleLogout();
      }
    }
      setBotonState(false);
  }

  const anularTurno = async () => {
    setBotonState(true)
    try {
      const { data } = await axios.get(`/turnos/anularTurno?cuil=${user.documento_persona}&id_tramite=${values.tramite}`)
    
      setNotificacion({ mensaje: "Turno Cancelado", tipo: "success" });
      setValues({ ...values, fecha: "" ,adicional:"",hora:""});
      setOperacionExitosa(undefined)
    } catch (error) {
      console.log(error);
      if(error?.response?.status== 401){
        handleLogout();
      }
    }
    setBotonState(false)
  }

  const nuevoTurno = () =>{
    setBotonState(true)
    setValues({ ...values, fecha: "",hora:"" });
    setOperacionExitosa(undefined)
    setBotonState(false)
  }

  const imprimirTurno = () => {
  // const props = { user: user, values: values, tramite:tramiteSelected };
  // navigate("/imprimirTurno",{state:props})
  navigate(`/imprimirTurno?cuil=${user.documento_persona}&tramite=${tramiteSelected.nombre_tramite}&id_tramite=${values.tramite}`);
  }

  const cambiarTurno = () =>{
    setcambiarTurnoNoti(true);
    setOpenAnularTurno(false);
    obtenerTurnosPorDia();
  }

  return (
    <div className='container mt-5'>
      <div className='row'>
        <div className='col-12'>
          <form >

            <div className='row mb-2 d-flex justify-content-center'>

              <h3 className='text-center mb-4'>Solicitud de Turnos</h3>
              <div className='col-md-6'>
                <div className="d-flex flex-column my-2">
                  <TextField
                    readOnly
                    className='mb-3 deshabilitarInputsTurno'
                    // eslint-disable-next-line react/prop-types
                    value={user.nombre_persona}
                    label="Nombre"
                    type="text"
                    name="nombre"
                    InputLabelProps={{ shrink: true }}

                  />
                  <TextField
                    readOnly
                    // eslint-disable-next-line react/prop-types
                    value={user.apellido_persona}
                    className='deshabilitarInputsTurno'
                    // onChange={handleChange}
                    label="Apellido"
                    type="text"
                    name="apellido"
                    InputLabelProps={{
                      shrink: true,
                    }}

                  />
                  {/* <TextField
                    readOnly
                    // eslint-disable-next-line react/prop-types
                    className='my-3'
                    value={user.domicilio_persona}
                    // onChange={handleChange}
                    label="Domicilio"
                    type="text"
                    name="descripcion"
                    InputLabelProps={{
                      shrink: true,
                    }}

                  /> */}
                      <TextField
                    readOnly
                    // eslint-disable-next-line react/prop-types
                    value={user.email_persona}
                    label="Email"
                    className='my-3 deshabilitarInputsTurno'
                    type="text"
                    name="descripcion"
                    InputLabelProps={{
                      shrink: true,
                    }}

                  />

                </div>
              </div>
              <div className='col-md-6'>
                <div className="d-flex flex-column my-2">

                  <TextField
                    readOnly
                    className='mb-3 deshabilitarInputsTurno'
                    // eslint-disable-next-line react/prop-types
                    value={user.telefono_persona}
                    // onChange={handleChange}
                    label="Teléfono"
                    type="text"
                    name="descripcion"
                    InputLabelProps={{
                      shrink: true,
                    }}

                  />
                  <TextField
                    readOnly
                    className='mb-3 deshabilitarInputsTurno'
                    // eslint-disable-next-line react/prop-types
                    value={user.documento_persona}
                    onChange={(e) => {
                      // Filtra solo los caracteres numéricos
                      const numericValue = e.target.value.replace(/\D/g, "");

                    }}
                    label="CUIL"
                    type="text"
                    name="cuil"
                    InputLabelProps={{
                      shrink: true,
                    }}

                  />
              
                </div>

              </div>
              {
                operacionExitosa == 1 &&
                <div className='col-md-5 turnoAsignado'>
                  <TextField
                    readOnly
                    className='mb-3 deshabilitarInputsTurno'
                    // eslint-disable-next-line react/prop-types
                    value={formatFecha(values.fecha)}
                    onChange={(e) => {
                      // Filtra solo los caracteres numéricos
                      const numericValue = e.target.value.replace(/\D/g, "");

                    }}
                    label="Fecha"
                    type="text"
                    name="fecha"
                    InputLabelProps={{
                      shrink: true,
                    }}

                  />
                  <TextField
                  className='deshabilitarInputsTurno'
                    readOnly
                    // eslint-disable-next-line react/prop-types
                    value={values.hora}
                    label="Hora"
                    type="text"
                    name="hora"
                    InputLabelProps={{
                      shrink: true,
                    }}

                  />
                  <div className='btnTurno'> 

                    <Button onClick={imprimirTurno} disabled={botonState} className='my-3' variant="contained">Imprimir Turno</Button>
                    <Button onClick={anularTurno} disabled={botonState} className='my-3 mx-2 mx-md-0' variant="contained">Cancelar Turno</Button>
                    <Button onClick={nuevoTurno} disabled={botonState} className='my-3 ' variant="contained">Nuevo Turno</Button>
                  </div>
                </div>
              }
            </div>
            {operacionExitosa != 1 &&

            <div>
            
              <div className='row mb-2'>
                <div className='col-md-4'>
                  <InputLabel className='text-black'>Trámites disponibles</InputLabel>
                  <Select
                    // eslint-disable-next-line react/prop-types
                    value={values.tramite}
                    onChange={handleChangeSelect}
                    name="tramite"
                    required
                    disabled={bandera || tramites.length == 0}
                    className="mt-2 inputsSacarTurno"
                    // label="Trámite"
                    // style={{ width: '100%' }}
                  >
                    {tramites.length > 0 &&
                      tramites.map((st, index) => (
                        <MenuItem key={index} value={st.idtramite}>
                          {st.nombre_tramite}
                        </MenuItem>
                      ))}
                  </Select>


                  <Button disabled={bandera || tramites.length == 0 || botonState} className='my-3' onClick={getDataExisteTurno} variant="outlined">Consultar Turnos</Button>
                  
                  
                </div>

                <div className='col-md-4'>
                  {
                    !bandera && values.fecha != "" ?
                      <>
                        <InputLabel className='text-black ms-lg-5 ps-md-2'>Fechas disponibles</InputLabel>

                        <DatePickerComponent fechasHabilitadas={fechasHabilitadas} handleInputChange={handleInputChange} values={values} setValues={setValues} botonState={botonState}/>

                        {/* <TextField
                        label="Fecha"
                        type="date"
                        className='mt-2'
                        disabled={flag}
                        value={values.fecha}
                        name="fecha"
                        onChange={handleInputChange}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          min: minDate,
                          max: maxDate
                        }}
                        style={{ width: '100%' }}
                      /> */}

                      </>
                      : bandera &&
                      // <Box className="d-flex justify-content-center mt-5">
                      //   <CircularProgress />
                      // </Box>
                      <div className='d-md-flex justify-content-center'>

                        <Box className="mt-3" sx={{ width: 200 }}>
                          <Skeleton />
                          <Skeleton animation="wave" />
                          <Skeleton animation={false} />
                        </Box>
                      </div>

                  }
                </div>


                <div className='col-md-4'>
                  {
                    !bandera && values.fecha != "" ?
                      <>
                        <InputLabel className='text-black mt-2 mt-md-0'>Horas disponibles</InputLabel>

                        <Select
                          // eslint-disable-next-line react/prop-types
                          value={values.hora}
                          onChange={handleChangeSelectHora}
                          name="hora"
                          // required
                          disabled={tramites.length === 0 || botonState}
                          className="mt-2 inputsSacarTurno"
                          // label="Trámite"
                          // style={{ width: '100%' }} 
                        >
                          {turnosPorHora.length > 0 && turnosPorHora.map((st, index) => (
                            <MenuItem key={index} value={st.hora_turno}>
                              {st.hora_turno}
                            </MenuItem>
                          ))}
                        </Select>

                      </>
                      : bandera &&
                      // <Box className="d-flex justify-content-center mt-5">
                      //   <CircularProgress />
                      // </Box>
                      <Box className="mt-3" sx={{ width: {xs:200, lg:400} }}>
                        <Skeleton />
                        <Skeleton animation="wave" />
                        <Skeleton animation={false} />
                      </Box>
                  }

                </div>

              </div>
              {
                tramiteSelected != "" &&
                <div className='row mb-2'>
                  <div className='col-md-6'>
                    <ObservacionesTramitesTextArea valor={tramiteSelected?.observaciones} />
                  </div>
                {
                  tramiteSelected.adicionalrequerido == 1 &&
                  <div className='col-md-6'>
                    <CampoAdicionalTurno valor={values.adicional} handleChange={handleChange} setNotificacion={setNotificacion} tramiteSelected={tramiteSelected} notificacion={notificacion}/>
                  </div>
                }
                </div>
              }
            </div>

            }

          </form>
          <ConfirmarTurnoModal open={open} setOpen={setOpen} values={values} setValues={setValues} confirmarTurno={confirmarTurno} tramiteSelected={tramiteSelected} setNotificacion={setNotificacion} botonState={botonState}/>
          <AnularTurnoModal openAnularTurno={openAnularTurno} setOpenAnularTurno={setOpenAnularTurno} anularTurno={anularTurno} values={values} imprimirTurno={imprimirTurno} botonState={botonState} cambiarTurno = {cambiarTurno}/>
        </div>

        {
          notificacion.mensaje != "" &&
          <Snackbar
            open={notificacion.mensaje != "" ? true : false}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "center", horizontal: "center" }}
          >
            <Alert className='mjeTurnos' severity={notificacion.tipo}>
                {notificacion.mensaje.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
              </Alert>
          </Snackbar>
        }
      </div>
    </div>

  )
}

export default Turnos