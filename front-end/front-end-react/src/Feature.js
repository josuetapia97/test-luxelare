import { Component } from 'react';


class Feature extends Component {

  render(){
    return(
      <div>
        <div>
         <h2>{this.props.state_name}</h2>
        </div>
        <div>
        Contagios: {this.props.state_contagios}
        </div>
        <div>
        Mujeres: {this.props.state_mujeres}
        </div>
        <div>
         Hombres: {this.props.state_hombres}
        </div>
        <div>
         Edad promedio: {this.props.state_edadPromedio}
        </div>
      </div>
    );
  }
};


export default Feature;
