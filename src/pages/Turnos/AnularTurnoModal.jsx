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

export default function AnularTurnoModal({ openAnularTurno, setOpenAnularTurno, anularTurno }) {
    //   const [open, setOpen] = React.useState(false);
    //   const handleOpen = () => setOpen(true);
    const handleClose = () => {
        anularTurno()
        setOpenAnularTurno(false)
    };

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
                    <div className='mt-3'>
                        <Button onClick={ handleClose } className='me-3'>Anular Turno</Button>
                        <Button className='me-3'>Reimprimir</Button>

                    </div>
                </Box>
            </Modal>
        </div>
    );
}
