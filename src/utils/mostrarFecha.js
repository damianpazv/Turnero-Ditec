
// import { format } from 'date-fns';

export function formatFecha(fechaOriginal) {
      // Dividir la fecha en año, mes y día
      const [ano, mes, dia] = fechaOriginal.split('-');
    
      // Formatear la fecha en el nuevo formato
      const fechaFormateada = `${dia}/${mes}/${ano}`;
  
      return fechaFormateada;
}



