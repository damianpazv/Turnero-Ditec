import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import es from 'date-fns/locale/es'; // Importa las traducciones al español
import { formatFecha } from '../../utils/mostrarFecha';

const DatePickerComponent = ({fechasHabilitadas, handleInputChange,values, setValues}) => {
  const [availableDates, setAvailableDates] = useState(fechasHabilitadas);
  const [dateSelected,setDateSelected] = useState(null)

  // Simulación de obtención de fechas disponibles desde la base de datos
  useEffect(() => {
    const data = ["2024-04-29","2024-04-30","2024-07-11"];
    console.log(fechasHabilitadas);
    const dates = fechasHabilitadas.map(dateString => {
      const [year, month, day] = dateString.split('-');
      // Crear un objeto Date y establecer la hora a medianoche localmente
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      date.setHours(0, 0, 0, 0);
      return date;
    });
    setAvailableDates(dates);
  }, []);
  
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Se agrega 1 porque los meses en JavaScript van de 0 a 11
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [flag,setFlag] = useState(false)

  const handleDateChange = date => {

    // Aquí puedes manejar el cambio de fecha como desees
    console.log(formatDate(date));
    setDateSelected(date);
    // formatFecha(formatDate(date))
    handleInputChange(formatDate(date) )
    setValues({ ...values, "fecha": formatDate(date) });
  };

  const handleInputClick = () => {
    setFlag(true); // Cambiar el estado de flag al hacer clic en el campo de entrada
  };

  useEffect(() => {
   setFlag(false)
  }, [dateSelected])
  
  return (
    
    <div onClick={handleInputClick}>
      <DatePicker
        className='mt-2 inputDatePicker text-center'
        includeDates={availableDates}
        placeholderText="Seleccione una fecha"
        selected={dateSelected}
        onChange={handleDateChange}
        name= "fecha"
        value={formatFecha(values.fecha)}
        dateFormat="dd-MM-yyyy"
         readOnly
         open={flag}
         locale={es} // Establece el idioma a español
      />
    </div>
  );
};

export default DatePickerComponent;