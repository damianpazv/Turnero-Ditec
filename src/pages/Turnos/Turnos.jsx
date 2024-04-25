import { Button, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react'
import axios from '../../config/axios';
import useStore from '../../Zustand/Zustand';

const Turnos = () => {

  const { user, authenticated, loading } = useStore();
  console.log(user);
  const [values, setValues] = useState({dni:"",descripcion:"",tramite:""});
  const [tramites , setTramites] = useState([])

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

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
      // setFlagButton(true);
      const resultado = await axios.get(`/turnos/existeTurno?cuil=${user.documento_persona}`);
     console.log(resultado);
      // setFormFlagReclamos(false)
      // setFlagButton(false);
    } catch (error) {
      console.log("mal");
      setErrorPermiso(error.response.data?.message || error.message)
    }
    // setFormFlagReclamos(true);
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
                    disabled
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
                    disabled
                    // eslint-disable-next-line react/prop-types
                    value={user.apellido_persona}
                    onChange={handleChange}
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
                    disabled
                    // eslint-disable-next-line react/prop-types
                    className='my-3'
                    value={user.domicilio_persona}
                    onChange={handleChange}
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
                    disabled
                    className='mb-3'
                    // eslint-disable-next-line react/prop-types
                    value={user.telefono_persona}
                    onChange={handleChange}
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
                    disabled
                    className='mb-3'
                    // eslint-disable-next-line react/prop-types
                    value={user.documento_persona}
                    onChange={(e) => {
                      // Filtra solo los caracteres numéricos
                      const numericValue = e.target.value.replace(/\D/g, "");

                      // Actualiza el estado solo si la entrada es numérica
                      handleChange({
                        target: {
                          name: "dni",
                          value: numericValue,
                        },
                      });
                    }}
                    label="DNI"
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
                    disabled
                    // eslint-disable-next-line react/prop-types
                    value={user.email_persona}
                    onChange={handleChange}
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
              <div className='col-md-6'>
                <InputLabel className='text-black'>Trámites disponibles</InputLabel>
                <Select
                  // eslint-disable-next-line react/prop-types
                  value={values.tramite}
                  onChange={handleChange}
                  name="tramite"
                  required
                  disabled={tramites.length === 0}
                  className="mt-2"
                  label="Trámite"
                  style={{ width: '100%' }} // Ancho completo en dispositivos pequeños
                >
                  {tramites.length > 0 &&
                    tramites.map((st, index) => (
                      <MenuItem key={index} value={st.idtramite}>
                        {st.nombre_tramite}
                      </MenuItem>
                    ))}
                </Select>
              </div>
            </div>
            <Button className='my-3' type='submit' variant="outlined">Solicitar Turno</Button>
          </form>
        </div>
      </div>
    </div>

  )
}

export default Turnos