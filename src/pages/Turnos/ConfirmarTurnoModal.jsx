import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { formatFecha } from '../../utils/mostrarFecha';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ConfirmarTurnoModal({open, setOpen,values}) {
//   const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
console.log(values);
  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Confirmar Turno
          </Typography>
          <div className='mt-4'>

          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Fecha: {formatFecha(values.fecha)}
           
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            
            Hora: {values.hora}
          </Typography>
          </div>
          <div className='mt-3'>
          <Button className='me-5'>Confirmar</Button>
          <Button onClick={handleClose}>Cancelar</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}
