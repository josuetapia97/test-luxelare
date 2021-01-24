import React,{Component} from 'react';
import {Bar} from 'react-chartjs-2';


export default class GraphBar extends Component{

  state = {
    data : {
     labels: [],
     datasets: []
   }
  }
  createSat(){
    let color = ['rgba(154, 205, 50, 0.56)','rgba(255, 215, 0, 0.56)','rgba(255, 0, 0, 0.56)']
    
    let dataContagios = this.props.dataContagios;
    let dataSospechosos = this.props.dataSospechosos;
    let dataNegativos = this.props.dataNegativos;
    let data ={
      labels: [this.props.label],
      datasets: [
        {
          label:dataContagios[0].name,
            backgroundColor: color[2],
            borderColor: color[2],
            borderWidth: 1,
            data:[dataContagios[0].count]
        },{
          label:dataSospechosos[0].name,
            backgroundColor: color[1],
            borderColor: color[1],
            borderWidth: 1,
            data:[dataSospechosos[0].count]
        },{
          label:dataNegativos[0].name,
            backgroundColor: color[0],
            borderColor: color[0],
            borderWidth: 1,
            data:[dataNegativos[0].count]
        }
      ]
    }
    return data;
  }

  createSate(){
    let color = ['rgba(197, 42, 134, 0.4)','rgba(12, 170, 238, 0.48)']
    let data ={
      labels: [this.props.label],
      datasets: this.props.dataArray.map((data,index) =>{
        
        return {
          label:data.name,
          backgroundColor: color[index],
          borderColor: color[index],
          borderWidth: 1,
          data:[data.count]
        }
      })
    }
    return data;
  }

  render() {
    const data = (this.props.label === 'sexo')?this.createSate():
    this.createSat();
    return (
      <div>
        <h2> { this.props.title }</h2>
        <Bar
          data={data}
          width={100}
          height={300}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            scales: {
              xAxes: [{
                gridLines: {
                  color: '#272827'
                }  
            }],
              yAxes : [{
                  ticks : {
                      min : 0,
                      fontColor: '#090a09'
                  },
                  gridLines: {
                    color: '#272827'
                }
                  
              }]
          }
          }}
        />
      </div>
    );
  }
};
