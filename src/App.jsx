import { Routes, Route, HashRouter } from "react-router-dom";
import Layout from "./common/Layout";
import PrivateRoute from "./routes/PrivateRoute";
import Turnos from "./pages/Turnos/Turnos";
import ImprimirTurno from "./pages/Turnos/ImprimirTurno";

function App() {
  const url = new URL(window.location.href);

  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
 
  // const reparti = params.get('rep');
  // const origen = params.get('destino');
  // console.log(reparti);

  const origen = url.searchParams.get("destino");
  const reparti = url.searchParams.get("rep");
  console.log(url.toString()); 

  if(localStorage.getItem("reparticion")){
    localStorage.setItem("reparticion", reparti != null ? reparti : localStorage.getItem("reparticion"));
  }else if(reparti){
    localStorage.setItem("reparticion", reparti);
  }

  if(localStorage.getItem("origen")){
    localStorage.setItem("origen", origen != null ? origen : localStorage.getItem("origen"));
  }else if(origen){
    localStorage.setItem("origen", origen);
  }

  // AUTHENTICACION
  const token = url.searchParams.get("auth");
  url.searchParams.delete("auth");
  url.searchParams.delete("rep");
  history.replaceState(null, '', url.toString());

  if (token && !localStorage.getItem("tokenSet")) {
    localStorage.setItem("token", token);
    localStorage.setItem("tokenSet", "true"); // Establecer la bandera
  }

  if (localStorage.getItem("token") == null || localStorage.getItem("reparticion") == null) {
    localStorage.removeItem("tokenSet");
    const url = new URL(`https://ciudaddigital.gob.ar/?rep=${localStorage.getItem("reparticion")}&destino=${localStorage.getItem("origen")}`);
    window.location.href = url.toString();
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
