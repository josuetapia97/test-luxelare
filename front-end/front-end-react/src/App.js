import './App.css';
import { MapContainer, TileLayer, GeoJSON} from 'react-leaflet';
import React,{ Component } from 'react';
import Feature from './Feature'
import { renderToString } from 'react-dom/server';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Loader from 'react-loader-spinner';
import NavBar from './NavBar';
import GraphBar from './GraphBar';
const states = require('./states.json');

function addProperties(states,estados){
  let estadoFeature = states.features;

  estadoFeature.forEach(geojson => {
    let properties = geojson.properties
    let state_name = properties.state_name.toLowerCase();
    let estadosAux = estados.filter(estado => estado.estado.toLowerCase()===state_name);
    let estadosObj = estadosAux[0]
    properties.contagios = estadosObj.datos.contagios
    properties.mujeres = estadosObj.datos.mujeres
    properties.hombres = estadosObj.datos.hombres
    properties.edadPromedio = estadosObj.datos.edadPromedio
  });
}
class App extends Component {
  state = {
    isLoading: true,
    posts: [],
    error: null
  }
  componentDidMount() {
    this.fetchPosts();
  };

  fetchPosts() {
    //fetch('http://localhost:5000/resumen')
    fetch('/resumen')
      .then(response => response.json())
      .then(
        estados =>{
          addProperties(states,estados.estados);
          this.setState({
            posts: estados,
            isLoading: false,
          })
        }
      )
      .catch(error => this.setState({ error:error }));
    };

    style(feature) {
        let color = 0;
        //en el pero de los casos nos devuelve untercio de 255 en el caso que haya muchos Contagios
        // tiende a regresarlos el gradiente del rojo completo en un formato rgb
        let colorSub = 255 * (feature.properties.contagios+1)/(feature.properties.contagios+10);
        let fillColor = color + colorSub;
        fillColor = parseInt(fillColor);
        fillColor = fillColor.toString(16);
        fillColor = '#'+fillColor+'0f0f';
        return {
            fillColor: fillColor,
            weight: 0.5,
            opacity: 1,
            color: '#070808',
            dashArray: '2',
            fillOpacity: 0.7
        };
    };
    onEachFeature(feature, layer) {
    const stateName = renderToString(<Feature
        state_name={feature.properties.state_name}
        state_code = {feature.properties.state_code}
        state_contagios = {feature.properties.contagios}
        state_mujeres = {feature.properties.mujeres}
        state_hombres = {feature.properties.hombres}
        state_edadPromedio = {feature.properties.edadPromedio}
      />);
    layer.bindPopup(stateName);
  }

  render(){
    const { isLoading, posts } = this.state;
    return (
      <div >
        <NavBar/>
        <div className='container'>
        
      <br/>
      <Router>
        <Route exact path="/" render={() =>
          <div>
          { (!isLoading) ? (<MapContainer center={[19.4326, -99.13]} zoom={5}>
            <TileLayer url="http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <GeoJSON  data={states} onEachFeature={this.onEachFeature} style={this.style}/>
          </MapContainer>)
            :(<Loader
               type="Puff"
               color="#00BFFF"
               height={100}
               width={100}
               timeout={3000} //3 secs

            />) }
          </div>
        }>
        </Route>
        <Route path="/sexo" render={() =>

          <div>
          { (!isLoading) ? (<GraphBar
          title = 'Grafica por sexo'
          label = 'sexo'
          dataArray = {posts.sexo}/>)
            :(<Loader
               type="Puff"
               color="#00BFFF"
               height={100}
               width={100}
               timeout={3000} //3 secs

            />) }
          </div>
        }>
        </Route>
        <Route path="/comparacion" render={() =>

          <div>
          { (!isLoading) ? (<GraphBar
          title = 'Grafica por casos [Confirmados, Sospechosos, Negativos]'
          label = 'Comparacion'
          dataContagios = {posts.confirmados}
          dataSospechosos = {posts.sospechosos}
          dataNegativos = {posts.negativos}/>)
            :(<Loader
              type="Puff"
              color="#00BFFF"
              height={100}
              width={100}
              timeout={3000} //3 secs

            />) }
          </div>
          }>
          </Route>
      </Router>
        </div>
      </div>
    );
  }
}

export default App;
