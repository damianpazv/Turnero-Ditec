import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button } from '@mui/material';
import useStore from './src/Zustand/Zustand';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
  };

  const ModalCerrarSesion = ({open,setOpen}) => {
      
      const { logoutTotem } = useStore();
      
      const handleContinue = () => {
          setOpen(false);
        };
        
      const handleLogout = () => {
        logoutTotem();
      };


  return (
    <Modal
    open={open}
    onClose={handleContinue}
    aria-labelledby="inactivity-modal-title"
    aria-describedby="inactivity-modal-description"
    BackdropProps={{
        onClick: (e) => e.stopPropagation() // Evitar que el modal se cierre al hacer clic fuera de él
      }}
  >
    <Box sx={style}>
      <Typography className='text-center' id="inactivity-modal-title" variant="h6" component="h2">
        ¿Deseas seguir operando?
      </Typography>
      <Typography className='text-center' id="inactivity-modal-description" sx={{ mt: 2 }}>
        Selecciona una opción para continuar.
      </Typography>
      <Box mt={2} display="flex" justifyContent="space-between">
        <Button variant="contained" color="primary" onClick={handleContinue}>
          Sí, deseo seguir
        </Button>
        <Button className='ms-3' variant="contained" color="error" onClick={handleLogout}>
          No, cerrar sesión
        </Button>
      </Box>
    </Box>
  </Modal>
  )
}

export default ModalCerrarSesion