import { Navigate } from "react-router-dom";
import useStore from "../Zustand/Zustand";
import { useEffect } from "react";
import { Box, CircularProgress } from "@mui/material";

// eslint-disable-next-line react/prop-types
const PrivateRoute = ({ children }) => {
  const { getAuth, authenticated, loading, logout } = useStore();
  
  useEffect(() => {
    getAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  useEffect(() => {
    if (!loading && !authenticated) {
      logout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, authenticated]);

  return loading ? (
    <Box sx={{ display: "flex" }}>
      <CircularProgress />
    </Box>
  ) : authenticated ? (
    children
  ) : (
    // <Navigate to="/login" />
    // <></>
    // logout()
    null
  );
};

export default PrivateRoute;
