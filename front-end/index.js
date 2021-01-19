function renderMap(estados){
let map = new L.Map("map", {center: [19.4326, -99.13], zoom: 5})
      .addLayer(new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"));
      //se agrega el geojson al mapa, es decir, las coordenadas de los estados, de esta forma
      // se dibujan los mismos sobre la imagen
      $.getJSON("states.geojson",setgeoJson);
     
      function setgeoJson(data)
      {
       var geoJsonLayer = L.geoJson(data, {        
         style: function(feature){
            let estadoFeature = feature.properties.state_name.toLowerCase();
            let estadosAux = estados.filter(estado => estado.estado.toLowerCase()===estadoFeature);
            let estadoObj = estadosAux[0];

           var fillColor;
           colors = {verde:"#6EB975", amarillo:"#D4D459", naranja:"#F3930F", rojo:"#F31F0A"};
           //la logica de poner el color en el mapa es basicamente la siguiente:
           // si es menor a 10 los caso confirmados ponemos de color verde 
           // entre 10 y 25 de color amarillo
           // entre 25 y 40 se pone de color naranja
           // en un caso mayor entonces se pone de color rojo
           // esto con un fin de simular el semaforo epidemiológico
           if (estadoObj.datos.contagios > 0 && estadoObj.datos.contagios < 5 ){
            fillColor = colors.amarillo;
           }else if(estadoObj.datos.contagios >= 5 && estadoObj.datos.contagios < 400){
            fillColor = colors.naranja;
           }else if(estadoObj.datos.contagios >= 400 ){
            fillColor = colors.rojo;
           }else{
            fillColor = colors.verde;
           }
           return { color: "#000", weight: 0.1, fillColor: fillColor, fillOpacity: .5 };
         },
         onEachFeature: function(feature, layer){            
           let estadoFeature = feature.properties.state_name.toLowerCase();
           let estadosAux = estados.filter(estado => estado.estado.toLowerCase()===estadoFeature);
           layer.bindPopup(
            `<strong style="text-align:center;font-size:1.5em;">${feature.properties.state_name}</strong>
             <br>
             <strong>Contagios totales:</strong> ${estadosAux[0].datos.contagios}
             <br>
             <strong>Contagios en mujeres:</strong> ${estadosAux[0].datos.mujeres}
             <br>
             <strong>Contagios en hombres:</strong> ${estadosAux[0].datos.hombres}
             <br>
             <strong>Edad promedio de contagios:</strong> ${estadosAux[0].datos.edadPromedio}
             `
           );
         }
       }
     ).addTo(map);
      }
}
//se hace la petición por el proxy
fetch('http://localhost:5000/resumen')
  .then(response => response.json())
  .then(estadosInfo => {
    renderMap(estadosInfo.estados);
  })
  .catch(err => console.log(err));