import React, { useState } from 'react';
import { LoadingButton } from "@mui/lab";
import { Box, Container, TextField, Typography } from "@mui/material";


const API_WEATHER = `https://api.weatherapi.com/v1/current.json?key=9de7c4cb88b549889e0152859230706&lang=es&q=`;

const BarradeBusqueda = () => {
  const [ciudad, establecerCiudad] = useState("");
  const [error, setError] = useState({
    error: false,
    mensaje: "",
  });
  const [cargando, setLoading] = useState(false);
  const [tiempo, establecerTiempo] = useState({
    ciudad: "",
    país: "",
    temperatura: 0,
    condición: "",
    conditionText: "",
    icono: "",
  });
  const [fechaHora, setFechaHora] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError({ error: false, mensaje: "" });
    setLoading(true);

    try {
      if (!ciudad.trim()) {
        throw new Error("El campo ciudad es obligatorio");
      }
    
      const res = await fetch(API_WEATHER + ciudad);
      const datos = await res.json();
    
      if (datos.error) {
        throw new Error(datos.error.mensaje);
      }

      const fechaActual = new Date();
      const horaActual = fechaActual.toLocaleTimeString();

      establecerTiempo({
        ciudad: datos.location.name,
        país: datos.location.country,
        temperatura: datos.current.temp_c,
        condición: datos.current.condition.code,
        conditionText: datos.current.condition.text,
        icono: datos.current.condition.icon,
      });

      setFechaHora(`${fechaActual.toDateString()} - ${horaActual}`);
    } catch (error) {
      // Handle the error here
      console.error(error);
      setError({ error: true, mensaje: error.message });
    }

    setLoading(false);
  };

  return (
      <Container className='container-fondo' maxWidth="lx" sx={{ mt: 0 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Aplicación Meteorológica
        </Typography>
        <Box
          className='barra-busqueda'  
          sx={{ display: "grid", gap: 2 , color: "black" }}
          component="form"
          autoComplete="off"
          onSubmit={onSubmit}
        >
          <TextField 
            id="ciudad"
            label="Ciudad"
            variant="outlined"
            size="small"
            required
            value={ciudad}
            onChange={(e) => establecerCiudad(e.target.value)}
            error={error.error}
            helperText={error.mensaje}
            sx={{
              backgroundColor: "white", // Cambiar el color de fondo aquí
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {borderColor: 'primary'}
            }}
            
          />

          <LoadingButton 
            type="submit"
            variant="contained"
            loading={cargando}
            loadingIndicator="Buscando..."
            sx={{ backgroundColor: '#1E4595', color: 'white' }}
          >
            Buscar
          </LoadingButton>
        </Box>

        {tiempo.ciudad && (
          <Box sx={{ mt: 2, display: "grid", gap: 2, textAlign: "center" }}>
            <Typography variant="h4" component="h2">
              {tiempo.ciudad}, {tiempo.país}
            </Typography>
            <Typography variant="h6" component="h4">
             {fechaHora}
            </Typography>
            <Box 
              component="img"
               alt={tiempo.conditionText}
              src={tiempo.icono}
              sx={{ margin: "0 auto" }}
            />
            <Typography variant="h5" component="h3">
             Temperatura: {tiempo.temperatura} °C 
            </Typography>
            <Typography variant="h6" component="h4">
              Condición: {tiempo.conditionText}
            </Typography>
          </Box>
        )}

        <Typography textAlign="center" sx={{ mt: 2, fontSize: "10px" }}>
          Desarrollado por:{" "}
          <a href="https://www.weatherapi.com/" title="Weather API">
            WeatherAPI.com
          </a>
        </Typography>
      </Container>
    
  );
};

export default BarradeBusqueda;

