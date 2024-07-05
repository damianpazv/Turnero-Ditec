import { Routes, Route, HashRouter } from "react-router-dom";
import Layout from "./common/Layout";
import PrivateRoute from "./routes/PrivateRoute";
import Turnos from "./pages/Turnos/Turnos";
import ImprimirTurno from "./pages/Turnos/ImprimirTurno";

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


  return (
    <>
    <HashRouter>
        <Layout>
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
