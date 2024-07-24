import { Routes, Route, HashRouter } from "react-router-dom";
import Layout from "./common/Layout";
import PrivateRoute from "./routes/PrivateRoute";
import Turnos from "./pages/Turnos/Turnos";
import ImprimirTurno from "./pages/Turnos/ImprimirTurno";
import ModalCerrarSesion from "../ModalCerrarSesion";
import { useEffect, useState } from "react";
import useStore from "./Zustand/Zustand";

function App() {
  const url = new URL(window.location.href);
  const token = url.searchParams.get("auth");

  if(localStorage.getItem("token")){
    localStorage.setItem("token", token != null ? token : localStorage.getItem("token"));
  }else if(token){
    localStorage.setItem("token", token);
  }

  const reparti = url.searchParams.get("rep"); 
  
  if(localStorage.getItem("reparticion")){
    localStorage.setItem("reparticion", reparti != null ? reparti : localStorage.getItem("reparticion"));
  }else if(reparti){
    localStorage.setItem("reparticion", reparti);
  }
  
  const origen = url.searchParams.get("destino");

  if(localStorage.getItem("origen")){
    localStorage.setItem("origen", origen != null ? origen : localStorage.getItem("origen"));
  }else if(origen){
    localStorage.setItem("origen", origen);
  }

  const totem = url.searchParams.get("totem");

  if(localStorage.getItem("totem")){
    localStorage.setItem("totem", totem != null ? totem : localStorage.getItem("totem"));
  }else if(totem){
    localStorage.setItem("totem", totem);
  }

  const [open, setOpen] = useState(false);
  const [timer, setTimer] = useState(0);
  const { logoutTotem } = useStore();

  const inactividad = () => {
  
     let timeoutid = setTimeout(() => {
        logoutTotem();
      }, 12000); // 12 segundos

      setTimer(timeoutid);    
  }

  useEffect(() => {
    let interval = 0
    if(totem == "true" && open == false){
      clearTimeout(timer);
      interval = setInterval(() => {
        setOpen(true);
        inactividad();
      }, 15000); // 15 segundos
  
    }
    return () => clearInterval(interval);
  }, [open]);

  return (
    <>
    <HashRouter>
        <Layout>
          <ModalCerrarSesion open={open} setOpen={setOpen}/>
          <Routes>
   
            <Route exact path="/*" element={<PrivateRoute key="turnos"><Turnos /></PrivateRoute>} />
            <Route exact path="/imprimirTurno" element={<PrivateRoute key="imprimirTurnos"><ImprimirTurno /></PrivateRoute>} />

          </Routes>
        </Layout>
      </HashRouter>
    </>
  );
}

export default App;
