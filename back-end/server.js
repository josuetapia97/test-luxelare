//esta funcion crea un resumen de todos los rows
//que se obtienen de la API
function json_data(json){
    let new_array = [];
    const records = json.records
    records.forEach(record =>{
        let obj = {}
        obj.entidad_res = record.fields.entidad_nac
        obj.municipio_res = record.fields.municipio_res
        obj.sexo = record.fields.sexo
        obj.edad = record.fields.edad
        obj.clas_final_escrita = record.fields.clas_final_escrita
        new_array.push(obj)
    });
    return new_array;
};

// se incluyen los modulos con los cuales se va a trabajar
const express = require('express');
const app = express();
const hostname = "localhost";
const port = 8000;

app.use(function (req, res, next) {
    // se cambia el ACAO para que permita el intercambio a cualquier origen
    // podemos especificar un unico origen.
    //otra solución para el CORS es crear un forward proxy en el servidorweb
    //ambas fueron implementadas
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
});

const https = require('https');
const url = 'https://datos.cdmx.gob.mx/api/records/1.0/search/?dataset=casos-asociados-a-covid-19&q=&rows=10000&facet=sexo&facet=entidad_nac&facet=municipio_res&facet=edad&facet=clas_final_escrita&facet=confirmados&facet=sospechosos&facet=negativos';

let json_response;
// se crea la peticion a la API de la CDMX
// y se procesan los datos para mandar un resumen 
https.get(url, (response)=>{
    let data = '';
    response.on('data',(chunk)=>{
        data += chunk;
    });
    response.on('end',()=>{
        json_response=JSON.parse(data);
        let estados = createStates(json_response);
        json_message = json_data(json_response);
        app.listen(port, () => console.log(`Server running at http://${hostname}:${port}/resumen`));
        digestFunction(estados.estados,json_message);
        app.get('/resumen', (req, res) => res.send(estados));
        
    });
}).on('error',(error) =>{
    console.log(error);
});

//procesa la informacion que obtiene de la API  sobre los casos de COVID
// y clasifica los casos segun el estado, sexo y edad.
// A pesar de que se tiene información relacionada en los campos facets
// de la API CDMX, en esta función se trata de hacer un acumulado
// de totales de casos confirmados, tanto en mujeres como en hombrea, así como
// la edad promedio por Estado de la republica, lo cual no se puede conseguir
// con los campos facets
function digestFunction(estados,casoCovid){
    estados.forEach(estado=>{
        let estadoEnt = estado.estado.toLowerCase();
        let casosEstado = casoCovid.filter(caso=>caso.entidad_res.toLowerCase()===estadoEnt);
        let contagios = 0
        let mujeres = 0
        let hombres = 0
        let edadPromedio = 0;
        casosEstado.forEach(casos =>{
            if (casos.clas_final_escrita.toLowerCase() === 'confirmados'){
                contagios ++;
                edadPromedio += casos.edad;
                if(casos.sexo.toLowerCase() === 'mujer'){
                    mujeres ++;
                }
                else if(casos.sexo.toLowerCase() === 'hombre'){
                    hombres ++;
                }
            }
        });
        edadPromedio = (casosEstado.length)?
        edadPromedio / casosEstado.length
        :0;
        edadPromedio = Math.round(edadPromedio,0)
        estado.datos.contagios = contagios;
        estado.datos.mujeres = mujeres;
        estado.datos.hombres = hombres
        estado.datos.edadPromedio = edadPromedio;
    });
};

//crea un arreglo de objetos, para trabajar con los
//acumulados de los estados y lo llene la funcion digestFunction
function createStates(response){
    
    let facet_group = response.facet_groups;
    //obtenemos los valores de los facets segun su posición
    //en el response de la API CDMX
    let entidad_res = facet_group[7];
    let sexo = facet_group[4];
    let confirmados = facet_group[5];
    let negativos = facet_group[6];
    let sospechosos = facet_group[1];
    let municipioRes = facet_group[3];
    let edad = facet_group[0];
    let arrayEntidad = [];
    entidad_res.facets.forEach(entidad =>{
        let objEntidad = {
            estado:entidad.name,
            datos:{
                contagios:0,
                mujeres:0,
                hombres:0,
                edadPromedio:0
            }
        }
        arrayEntidad.push(objEntidad);
    });
    //filtramos los campos de los facets para que solo obtengamos
    //el nombre y la cuenta de los casos, como se puede
    //apreciar en la arrow function filterFacets
    let responseObj = {
        estados:arrayEntidad,
        sexo:sexo.facets.map(filterFacets),
        confirmados:confirmados.facets.map(filterFacets),
        negativos:negativos.facets.map(filterFacets),
        sospechosos:sospechosos.facets.map(filterFacets),
        edad:edad.facets.map(filterFacets),
        municipioRes:municipioRes.facets.map(filterFacets),
        edad:edad.facets.map(filterFacets)
    }
    return responseObj;
}

let filterFacets = (facet) =>{
    return {name:facet.name,
        count:facet.count}  
}
