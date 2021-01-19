const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
//se crea un middleware para el proxy que redirija
//el tráfico hacia el servidor web 
const covidApi = createProxyMiddleware({
  target: 'http://covid-api:8000',
  changeOrigin: true,
  secure:false,
});
//se crea un middleware para el proxy que redirija
//el tráfico hacia el servidor de la API
const covidFront = createProxyMiddleware({
    target: 'http://covid-frontend',
    changeOrigin: true,
    secure:false,
  });

const app = express();
//se añade el middleware al servidor
app.use('/resumen', covidApi);
app.use('/', covidFront);

app.listen(5000);