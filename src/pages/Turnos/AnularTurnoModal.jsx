import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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

export default function AnularTurnoModal({ openAnularTurno, setOpenAnularTurno, anularTurno,values }) {
    //   const [open, setOpen] = React.useState(false);
    //   const handleOpen = () => setOpen(true);
    const handleClose = () => {
        anularTurno()
        setOpenAnularTurno(false)
    };

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
            {/* <Button onClick={handleOpen}>Open modal</Button> */}
            <Modal
                open={openAnularTurno}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpenAnularTurno(false)}
                        style={{ position: 'absolute', top: 0, right: 0 }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Turno Existente
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Usted ya tiene un turno para el trámite ingresado.
                    </Typography>
                    <div className='mt-4'>

                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            Fecha: {formatFechaTurno(values.fechaAnularTurno)}

                        </Typography>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>

                            Hora: {values.hora}
                        </Typography>
                    </div>
                    <div className='mt-3'>
                        <Button onClick={ handleClose } className='me-3'>Cancelar Turno</Button>
                        <Button className='me-3'>Reimprimir</Button>

                    </div>
                </Box>
            </Modal>
        </div>
    );
}
