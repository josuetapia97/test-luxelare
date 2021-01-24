# Prueba fullstack developer luxelare - Caso practico estudio de COVID-19 en México


### Pre-requisitos

_herramientas necesarias para instalar proyecto_

- Git versión 2.24.3
- Docker versión 20.10.2
- Docker-compose versión 1.27.4
- kind versión 0.9.0
- kubectl
## Comenzando

_Replica en maquina local_

se introduce el siguiente comando el la ruta que se deseé clonar el repo

- git clone https://github.com/josuetapia97/test-luxelare.git

## Ejecutando las pruebas

_Pasos para correr el proyecto_

- nos posicionamos dentro de la carpeta test-luxelare

_corremos el siguiente comando_
- docker-compose build


_esto para construir nuestras imágenes en docker (puede tardar algunos minutos)_
- docker-compose up


_esto para correr las imágenes creadas en sus respectivos containers_

_Nota: debemos esperar aproximadamente 10 segundos en lo que la API obtiene los datos_

### Pruebas de funcionamiento

_se realizaran pruebas de funcionamiento para validar que se cumplen con los puntos solicitados_

¡¡¡ IMPORTANTE !!!, para la versión uno de esta prueba se hacia el conteo por estado de la republica con base en un facet denominado entidad_res(entidad residencia), sin embargo, el día  22/01/2021 se modificó ese campo directamente desde la API de CDMX provocando solo un registro de la ciudad de México y no la de los 32 estados, por lo que se modifico ese facet y se ocupo el de entidad_nac (entidad nacimiento)

Para realizar las pruebas de funcionamiento, podemos acceder en nuestro browser e introducir la siguiente URL
- http://localhost:8000

podemos apreciar que nos muestra el siguiente mensaje 

_Cannot GET /_

No nos preocupemos, no pasa nada, el backend solo atiende peticiones sobre el path **/resumen**
como fue solicitado.


Entonces realizamos la petición a:

- http://localhost:8000/resumen

o de igual forma podemos ingresar el siguiente comando en la terminal de nuestra computadora

- curl http://localhost:8000/resumen

y obtener los datos de la API 

¡Excelente!
aquí se cumple el punto 0 del challenge

continuemos....

En el mismo navegador podemos abrir una nueva pestaña e ingresar a la siguiente dirección

- http://localhost:9000

¡ Ups ! ¿qué paso? al parecer no se puede ver el dash ....

Es normal, lo que sucede es que los contenedores están separados en dos redes diferentes según el diseño del archivo compose que se creó (esto no se pidió pero se trato de simular un escenario en donde los servidores se encuentran en diferentes redes),
entonces al querer hacer fetch a la api (backend) no lo puede alcanzar. A pesar de esto se puede comprobar la funcionalidad del frontend y si aun no me crees, espera a que lleguemos al funcionamiento del proxy.

¡¡¡perfecto!!! 

corroboramos el funcionamiento del frontend.

De igual forma podemos hacer una petición al servidor web desde la terminal

- curl http://localhost:9000

Solo vamos a ver código en html y javascript (para el caso de React) pero de igual forma corroboramos funcionamiento del frontend

¡Súper! ya cubrimos el punto 0 y 1

continuemos .....

Para el punto 2 se solicita meter la solución del frontend en un contenedor.

Se pidio realizar el frontend en React, por lo que se diseñó un pequeño servidor en Nodejs, debido a esto tambien se tuvo que crear un nuevo Dockerfile con una imagen base de Node, para mayor detalle podemos ver el archivo front-end/front-end-react/Dockerfile

¡Fantástico!

continuemos ......

Para la solución del punto 3 se diseño un reverse proxy en Nodejs que se encarga de dirigir el tráfico a los servidores.

De esta forma si accedemos a la dirección:

- http://localhost:5000

podemos ver el sitio web, y aquí es donde se comprueba visualmente que el frontend funciona, debido a que el proxy tiene acceso a ambas redes tanto del back como del front es que puede dirigir el trafico a ambos servers.

y si accedemos a:

- http://localhost:5000/resumen

obtenemos la respuesta del backend

con esto se solucionó el punto 3.
Para más información del diseño del reverse proxy, se puede acceder al archivo proxy/proxy-nodejs/server.js

Para validar la funcionalidad de kubernetes (punto 4) primero hay que crear un cluster con ayuda de kind

- kind create cluster --name luxelare

esto puede tardar algunos minutos, pero es más por la descarga de la imagen de docker que se necesita para crear el cluster. Una vez descargada la imagen, el crear un cluster es más rápido.

ahora se procede a correr el archivo YAML que tiene la configuración para creación de los pods y de los servicios

- kubectl apply -f deployments-services-config.yml

corroboramos que en efecto se hayan creado los pods, los servicios y que se les haya asociado un endpoint a cada servicio
(Puede tardar algunos minutos en lo que el pod tenga status en running)

- kubectl get pod
- kubectl get services o kubectl get svc
- kubectl get endpoints

ahora podemos corroborar que haya comunicación entre los servicios, podemos hacer las siguientes pruebas

- kubectl exec -it service/covid-api -n default -- sh

 ahora nos encontramos en el shell de la imagen del contenedor

 podemos descargar curl para hacer una petición a algún servicio
 
 - apk add curl

 por ejemplo
 - curl http://covid-frontend

 vemos que nos responde el servicio

ahora podemos salirnos

- exit

e ingresar a otro shell

- kubectl exec -it service/covid-proxy -n default -- sh

esta imagen ya cuenta con curl instalado por lo que directamente podemos hacer uso de él

- curl http://covid-api/resumen
- curl http://covid-frontend

corroboramos conectividad con los servicios

ahora podemos mapear un puerto para alcanzar el proxy y ver la aplicación desde el exterior,
sin embargo, todos los servicios se están comunicando por medio del cluster. Es importante que para este punto o apaguemos todo el compose que creamos o bien que solo cerremos el contenedor con el puerto 5000 que es el del proxy.

- kubectl port-forward service/covid-proxy 5000:5000 -n default

y acceder desde el navegador a:

- http://localhost:5000

se comprueba la conexión y funcionalidad de kubernetes
