import { Routes, Route, HashRouter } from "react-router-dom";
import Layout from "./common/Layout";
import PrivateRoute from "./routes/PrivateRoute";
import Turnos from "./pages/Turnos/Turnos";
import ImprimirTurno from "./pages/Turnos/ImprimirTurno";

function App() {
  const url = new URL(window.location.href);

  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const reparti = params.get('rep');
  console.log(reparti);

  if(localStorage.getItem("reparticion")){
    localStorage.setItem("reparticion", reparti != null ? reparti : localStorage.getItem("reparticion"));
  }else if(reparti){
    localStorage.setItem("reparticion", reparti);
  }

  // AUTHENTICACION
  const token = url.searchParams.get("auth");
  url.searchParams.delete("auth");
  url.searchParams.delete("rep");
  history.replaceState(null, '', url.toString());
  // Verificar si el token está presente en la URL y si aún no se ha guardado en el localStorage
  if (token) {
    localStorage.setItem("token", token);
  } else if (!token && localStorage.getItem("token") == null) {
    const url = new URL(`https://smt.gob.ar/`);
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
