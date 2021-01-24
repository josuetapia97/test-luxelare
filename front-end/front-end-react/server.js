const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const app = express();
const hostname = 'localhost';
const port = 80;

//se crea un proxy para evitar las restricciones de solicitudes cross-site o Same Origin Policy
// esto solo se pudó solucionar cambiando la cabecera http de la API
// permitiendo cualquier origen, sin embargo, al crear un proxy
// tambien permite hacer fetch dentro de contenedores o en kubernetes
const covidApi = createProxyMiddleware({
  target: 'http://covid-api:8000',
  changeOrigin: true,
  secure:false,
});

app.use('/resumen', covidApi);

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function(req,res) {
    console.log('GET: '+req.headers.referer);
		res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => console.log(`Server running at http://${hostname}:${port}`));