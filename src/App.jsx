import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import { Routes, Route, HashRouter } from "react-router-dom";
import Layout from "./common/Layout";
import CapitalHumano from "./pages/CapitalHumano/CapitalHumano";
import Reclamos from "./pages/EstadisticasReclamos/Reclamos";
import PrivateRoute from "./routes/PrivateRoute";
import Perfil from "./pages/Perfil/Perfil";
import { Registro } from "./components/Registro/Registro";
import PanelAdmin from "./components/Admin/PanelAdmin";
import Turnos from "./pages/Turnos/Turnos";
import ImprimirTurno from "./pages/Turnos/ImprimirTurno";

function App() {
  const url = new URL(window.location.href);
  const logout = url.searchParams.get("logout");

  const queryString = window.location.search;
  const params = new URLSearchParams(queryString);
  const reparti = params.get('rep');
  localStorage.setItem("reparticion", reparti? reparti : 1711);

  url.searchParams.delete("logout");
  history.replaceState(null, '', url.toString());

  if(logout){
    localStorage.removeItem("token");
  }
  return (
    <>
    <HashRouter>
        <Layout>
          <Routes>
            <Route exact path="/*" element={<Login />} />
            {/* <Route exact path="/home" element={<PrivateRoute key="home"><Home /></PrivateRoute>} /> */}
            <Route exact path="/turnos" element={<PrivateRoute key="turnos"><Turnos /></PrivateRoute>} />
            <Route exact path="/imprimirTurno" element={<PrivateRoute key="imprimirTurnos"><ImprimirTurno /></PrivateRoute>} />
            <Route exact path="/registro" element={<Registro />} /> 

            {/* <Route exact
              path="/estadistica_rrhh"
              element={
                <PrivateRoute key="cap-humano">
                  <CapitalHumano />
                </PrivateRoute>
              }
            />
            <Route exact
              path="/estadistica_ac"
              element={
                <PrivateRoute key="reclamos">
                  <Reclamos />
                </PrivateRoute>
              }
            /> */}

            {/* <Route exact path="/perfil" element={
            <PrivateRoute key="perfil"><Perfil /></PrivateRoute>
            } /> */}

            {/* <Route exact path="/panel_admin" element={<PanelAdmin />} /> */}

          </Routes>
        </Layout>
      </HashRouter>
    </>
  );
}

export default App;
