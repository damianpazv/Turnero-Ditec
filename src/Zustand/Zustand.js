import { create } from 'zustand';
import axios from '../config/axios';

const useStore = create((set,get) => ({
  errors: "",
  setErrors: (newValues) => set(() => ({ errors: newValues })),

  authenticated: false,

  user: null,

  loading: true,
  
  botonState: false,

  login: async (values) => {
    set({ botonState: true });
    try {
      set({errors : ""})
      const { data } = await axios.post("/usuarios/login", values);
    
      set({
        authenticated: !!data.user.usuarioSinContraseña
      });
      set({user:data.user.usuarioSinContraseña});
      axios.defaults.headers.common["Authorization"] = data.token;
      localStorage.setItem("token", data.token);
    } catch (error) {
        set({errors : error.response.data?.errors?.length > 0 ?  error.response.data.errors[0].msg : error.response?.data?.message? error.response?.data.message: error.message});
    }
    set({ botonState: false });
  }
  ,

  logout:() => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenSet");
    // localStorage.removeItem("reparticion");
    set({authenticated: false });

    const url = new URL(`https://ciudaddigital.smt.gob.ar/#/login`);
    // const url = new URL(`http://localhost:5173/`);
    url.searchParams.append("logout", true);
    url.searchParams.append("destino", localStorage.getItem("origen"));
    url.searchParams.append("rep", localStorage.getItem("reparticion"));
    window.open(url.toString(), '_self');
  },

  getAuth: async () => {
    try {
      const url = new URL(window.location.href);
      const tokenURL = url.searchParams.get("auth");

      url.searchParams.delete("auth");
      url.searchParams.delete("rep");
      history.replaceState(null, "", url.toString());

      const token = tokenURL? tokenURL : localStorage.getItem("token");
      if (!token) {
        set({ loading: false });
        // return set({ authenticated: false });
        set({ authenticated: false });
        localStorage.removeItem("token");
        return get().logout();
      }
      axios.defaults.headers.common["Authorization"] = token;
      const { data } = await axios.get("/usuarios/authStatus");
      set({user:data.usuarioSinContraseña});
      set({
        authenticated: true
      });
    } catch (error) {
      set({ authenticated: false});
      get().logout();
      localStorage.removeItem("token");
      console.log("error de auth");
      console.log(error)
    }
    set({ loading: false});
  },

  updateUser: (newUserData) => {
    set({ user: newUserData });
  },
  
}))

export default useStore;