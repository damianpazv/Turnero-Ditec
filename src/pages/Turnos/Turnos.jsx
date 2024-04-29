import { Alert, Box, Button, CircularProgress, InputLabel, MenuItem, Select, Snackbar, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import axios from '../../config/axios';
import useStore from '../../Zustand/Zustand';
import "./Turnos.css"
import DatePickerComponent from './Fechas';
import ConfirmarTurnoModal from './ConfirmarTurnoModal';

const Turnos = () => {

  const { user, authenticated, loading } = useStore();
 
  const [tramites , setTramites] = useState([])
  const [existeTurno , setExisteTurno] = useState(null)
  const [turnosPorDia, setTurnosPorDia] = useState([]);
  const [turnosPorHora, setTurnosPorHora] = useState([]);

  const [flag , setFlag] = useState(false)
  const [error, setError] = useState("");
  
  const [minDate , setMinDate] = useState("")
  const [maxDate , setMaxDate] = useState("")
  const [fechasHabilitadas,setFechasHabilitadas] = useState([]);
  
  const [values, setValues] = useState({dni:"",descripcion:"",tramite:"",fecha: ""});

  const handleChangeSelect = (e) => {

    console.log(e.target);
    setValues({ ...values, [e.target.name]: e.target.value, fecha:"" });
    console.log(e.target.value);

  };


  const [open, setOpen] = useState(false);

  const handleChangeSelectHora = (e)=>{
   
    setValues({ ...values, [e.target.name]: e.target.value });
    console.log(e.target.value);
    setOpen(true)

  }

  const obtenerTramites = async ()=>{
    try {
      const {data} = await axios.get("/turnos/listarTramites?reparticion_id=1800")
      console.log(data);
      setTramites(data.tramites)
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    obtenerTramites();
  }, [])
  

  const getData = async (e) => {
    // setFormFlagReclamos(false);
    e.preventDefault();
    try {
      setFlag(true);
      // setFlagButton(true);
      const resultado = await axios.get(`/turnos/existeTurno?cuil=${user.documento_persona}&id_tramite=${values.tramite}`);
     console.log(resultado.data[0][0] == 0);
     setExisteTurno(resultado.data[0][0] == 0 ? false : true)

      // setFormFlagReclamos(false)
      // setFlagButton(false);
    } catch (error) {
      console.log("mal");
      setErrorPermiso(error.response.data?.message || error.message)
    }
    // setFormFlagReclamos(true);
  };

  const obtenerTurnosPorDia = async (e) => {
    // setFormFlagReclamos(false);
    // e.preventDefault();
    try {
      // setFlagButton(true);
      const resultado = await axios.get(`/turnos/buscarTurnosDisponiblesPorDia?id_tramite=${values.tramite}`);
      console.log(resultado);
      setTurnosPorDia(resultado.data)
      setExisteTurno(null)
      if(resultado.data.length == 0){
        setError("El trámite ingresado no tiene turnos disponibles")
        setFlag(false)
      }
      const fechasOrdenadas = resultado.data.map(fecha => new Date(fecha.dia_turno));
      const fechaMinima = new Date(Math.min(...fechasOrdenadas));
      const fechaMaxima = new Date(Math.max(...fechasOrdenadas));

      // Formatea las fechas para establecer el valor de los atributos min y max del input
      const minDate = fechaMinima.toISOString().split('T')[0];
      const maxDate = fechaMaxima.toISOString().split('T')[0];

      setValues({...values,fecha:minDate})
      obtenerTurnosPorHora(minDate)

      setMinDate(minDate);
      setMaxDate(maxDate);

      console.log(minDate);
      console.log(maxDate);

      
      
      const fechasConFormatoCorrecto = resultado.data.map(item => item.dia_turno.split('T')[0]);

      console.log(fechasConFormatoCorrecto);
      const fechasHabilitadas = ["2024-04-27", "2024-04-28"];
      setFechasHabilitadas(fechasConFormatoCorrecto);

    
      // setFormFlagReclamos(false)
      // setFlagButton(false);
    } catch (error) {
      console.log(error);
      console.log("mal");
      // setErrorPermiso(error.response.data?.message || error.message)
    }
    // setFormFlagReclamos(true);
  };

  useEffect(() => {
   if(existeTurno == false){
    obtenerTurnosPorDia();
    // setExisteTurno(null)
   }
   console.log("holka");
  }, [existeTurno])

  const eliminarDuplicados = (array) => {
    return array.filter((elem, index, self) => {
        return index === self.findIndex((t) => (
            t.hora_turno === elem.hora_turno
        ));
    });
};

  const obtenerTurnosPorHora = async (fecha) => {
    console.log(fecha);
    try {
      const resultado = await axios.get(`/turnos/buscarTurnosDisponiblesPorHora?id_tramite=${values.tramite}&fecha_solicitada=${fecha}`);
      console.log(resultado);
      setTurnosPorHora(eliminarDuplicados(resultado.data));
      if(resultado.data.length == 0){
        setError("No hay turnos disponibles para la fecha ingresada")
      }
      setFlag(false);
    } catch (error) {
      console.log(error);
    }
  }

  const handleInputChange = (value) => {

   
    console.log(value);
    if(value != ""){
      setFlag(true)
      setTurnosPorHora([])
      obtenerTurnosPorHora(value);
    }
    
  
    // if (fechasHabilitadas.includes(value)) {
    //   setValues({ ...values, [name]: value });
     
    // }else{
    //   setError("No hay turnos disponibles para la fecha ingresada")
    // }


  };

   const handleCloseSnackbar = () => {
    setError("");
  };


  return (
    <div className='container mt-5'>
      <div className='row'>
        <div className='col-12'>
          <form onSubmit={getData}>

            <div className='row mb-2'>

              <h3 className='text-center mb-4'>Solicitud de Turnos</h3>
              <div className='col-md-6'>
                <div className="d-flex flex-column my-2">
                  <TextField
                    readOnly
                    className='mb-3'
                    // eslint-disable-next-line react/prop-types
                    value={user.nombre_persona}
                    label="Nombre"
                    type="text"
                    name="nombre"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ maxLength: 20 }}
                  />
                  <TextField
                    readOnly
                    // eslint-disable-next-line react/prop-types
                    value={user.apellido_persona}
                    // onChange={handleChange}
                    label="Apellido"
                    type="text"
                    name="apellido"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      maxLength: 20, // Establece la longitud máxima según tus necesidades
                    }}
                  />
                  <TextField
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
                    inputProps={{
                      maxLength: 20, // Establece la longitud máxima según tus necesidades
                    }}
                  />

                </div>
              </div>
              <div className='col-md-6'>
                <div className="d-flex flex-column my-2">

                  <TextField
                    readOnly
                    className='mb-3'
                    // eslint-disable-next-line react/prop-types
                    value={user.telefono_persona}
                    // onChange={handleChange}
                    label="Teléfono"
                    type="text"
                    name="descripcion"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      maxLength: 20, // Establece la longitud máxima según tus necesidades
                    }}
                  />
                  <TextField
                    readOnly
                    className='mb-3'
                    // eslint-disable-next-line react/prop-types
                    value={user.documento_persona}
                    onChange={(e) => {
                      // Filtra solo los caracteres numéricos
                      const numericValue = e.target.value.replace(/\D/g, "");

                      // Actualiza el estado solo si la entrada es numérica
                      // handleChange({
                      //   target: {
                      //     name: "dni",
                      //     value: numericValue,
                      //   },
                      // });
                    }}
                    label="CUIL"
                    type="text"
                    name="dni"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      maxLength: 4,
                      minLength: 4 // Establece la longitud máxima según tus necesidades
                    }}
                  />
                  <TextField
                    readOnly
                    // eslint-disable-next-line react/prop-types
                    value={user.email_persona}
                    // onChange={handleChange}
                    label="Email"
                    type="text"
                    name="descripcion"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      maxLength: 20, // Establece la longitud máxima según tus necesidades
                    }}
                  />
                </div>

              </div>
            </div>
            <div className='row mb-2'>
              <div className='col-md-4'>
                <InputLabel className='text-black'>Trámites disponibles</InputLabel>
                <Select
                  // eslint-disable-next-line react/prop-types
                  value={values.tramite}
                  onChange={handleChangeSelect}
                  name="tramite"
                  required
                  disabled={tramites.length === 0 && flag}
                  className="mt-2"
                  // label="Trámite"
                  style={{ width: '100%' }} // Ancho completo en dispositivos pequeños
                >
                  {tramites.length > 0 &&
                    tramites.map((st, index) => (
                      <MenuItem key={index} value={st.idtramite}>
                        {st.nombre_tramite}
                      </MenuItem>
                    ))}
                </Select>
                
                
                <Button disabled={flag} className='my-3' type='submit' variant="outlined">Consultar Turnos</Button>
              </div>

                <div className='col-md-4'>
                  <InputLabel className='text-black'>Fechas disponibles</InputLabel>
                {
                  turnosPorDia.length && !flag > 0 && values.fecha != ""?
                    <>
                      
                        <DatePickerComponent fechasHabilitadas={fechasHabilitadas} handleInputChange={handleInputChange} values = {values} setValues = {setValues}/>
                      
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
                    : flag &&
                    <Box className="d-flex justify-content-center mt-5">
                      <CircularProgress />
                    </Box>
                   
                }
                </div>

                
                <div className='col-md-4'>
                  <InputLabel className='text-black'>Horas disponibles</InputLabel>
                {
                  turnosPorDia.length && !flag > 0 && values.fecha != ""?
                    <>
                      {/* {
                       turnosPorHora.length>0 && turnosPorHora.map((t, index) => (
                          <li key={index} >
                            {t.hora_turno}
                          </li>
                        ))
                      } */}

                      <Select
                        // eslint-disable-next-line react/prop-types
                        value={values.hora}
                        onChange={handleChangeSelectHora}
                        name="hora"
                        required
                        disabled={tramites.length === 0 && flag}
                        className="mt-2"
                        // label="Trámite"
                        style={{ width: '100%' }} // Ancho completo en dispositivos pequeños
                      >
                        {turnosPorHora.length>0 && turnosPorHora.map((st, index) => (
                            <MenuItem key={index} value={st.hora_turno}>
                              {st.hora_turno}
                            </MenuItem>
                          ))}
                      </Select>

                    </>
                    : flag &&
                    <Box className="d-flex justify-content-center mt-5">
                      <CircularProgress />
                    </Box>
                   
                }
           
                </div>
             
            </div>
          
          </form>
      <ConfirmarTurnoModal open={open} setOpen={setOpen} values = {values}/>
        </div>
        {
          error != "" &&
          <Snackbar
          open={error != "" ? true : false}
          autoHideDuration={5000000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "center", horizontal: "center" }} // Ajusta la posición del Snackbar
        >
          <Alert severity="warning">{error}</Alert>
        </Snackbar>
        }
      </div>
    </div>

  )
}

export default Turnos