import * as React from 'react';
import { TextareaAutosize as BaseTextareaAutosize } from '@mui/base/TextareaAutosize';
import { styled } from '@mui/system';
import { useEffect } from 'react';
import { useRef } from 'react';

export default function CampoAdicionalTurno({valor,handleChange,setNotificacion,tramiteSelected,notificacion}) {

    const textareaRef = useRef(null);

    useEffect(() => {
        if (textareaRef.current && tramiteSelected.adicionalrequerido == 1) {
          textareaRef.current.focus();
        }
      }, [tramiteSelected,notificacion]);

    const handleChangeWithMaxLength = (event) => {
        const { value } = event.target;
        if (value.length <= 300) {
          handleChange(event);
        } else {

            setNotificacion({ mensaje: "No puede ingresar mas de 300 caracteres", tipo: "error" });
        }
      };


  return <TextareaAutosize disabled={tramiteSelected.adicionalrequerido == 0} ref={textareaRef} name='adicional' onChange={handleChangeWithMaxLength} value={valor} aria-label="empty textarea" placeholder={`Ingrese lo pertinente a su trámite ${tramiteSelected.adicionalrequerido == 1? "*": ""}`}/>
}

const blue = {
  100: '#DAECFF',
  200: '#b6daff',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  900: '#003A75',
};

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const TextareaAutosize = styled(BaseTextareaAutosize)(
  ({ theme }) => `
  box-sizing: border-box;
  width: 100%;
  height: 150px !important;
  overflow-y: scroll !important;
  resize: none;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 8px;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
  box-shadow: 0px 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};

  &:hover {
    border-color: ${blue[400]};
  }

  &:focus {
    border-color: ${blue[400]};
    box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
);