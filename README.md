# Prueba fullstack developer luxelare - Caso practico estudio de COVID en México


### Pre-requisitos

_herramientas necesarias para instalar proyecto_

- Git version 2.24.3
- Docker version 20.10.2
- Docker-compose version 1.27.4
## Comenzando

_Replica en maquina local_

se introduce el siguiente comando el la ruta que se deseé clonar el repo

- git clone https://github.com/josuetapia97/test-luxelare.git

## Ejecutando las pruebas

_Pasos para correr el proyecto_

- nos posisionamos dentro de la carpeta test-luxelare

_corremos el siguiente comando_
- docker-compose build


_esto para construir nuestras imagenes en docker_
- docker-compose up


_esto para correr las imagenes creadas en sus respectivos containers_

_Nota: debemos esperar aproximadamente 10 s en lo que la API obtiene los datos_

### Pruebas de funcionamiento

_se realizaran pruebas de funcionamiento para validar que se cumplen con los puntos solicitados_

antes de comenzar, para la version uno se hacia el conteo por estado de la republica con base en un facet denominado entidad_res(entidad recidencia), sin embargo, el día  22/01/2021 se modificó ese campo directamente desde la API de CDMX probocando solo un registro de la ciudad de México y no la de los 32 estados, por lo que se modifico ese facet y se ocupo el de entidad_nac (entidad nacimiento)

Para realizar las pruebas de funcionamiento, podemos acceder en nuestro browser e introducir la siguiente URL
- http://localhost:8000
podemos apreciar que nos muestra el siguiente mensaje 
_Cannot GET /_
No nos preocupemos, no pasa nada, el backend solo atiende peticiones sobre el path **/resumen**
como fue solicitado
entonces se realiza la peticion a:
- http://localhost:8000/resumen
o de igual forma podemos ingresar el siguiente comando en la terminal de nuestra computadora
- curl http://localhost:8000/resumen
y obtener los datos de la API 

¡Excelente!
aquí se cumple el punto 0 del challenge
continuemos....

En el mismo navegador podemos abrir una nueva pestaña e ingresar a la siguiente dirección
- http://localhost:9000

perfecto!!! 
corroboramos el funcionamiento del fronend
de igual forma podemos hacer una petición al servidor web desde la terminal

- curl http://localhost:9000

Solo vamos a ver código en html pero de igual forma corroboramos funcionamiento del frontend

¡Super! ya cubrimos el punto 0 y 1

continuemos .....

Para el punto 2 se solicita meter la solución del frontend en un contenedor el cual ya está corriendo para cubrir el punto anterior. Se puede ver el documento front-end/Dockerfile en donde utilice una imagen de nginx como servidor web.

¡Fantastico!

continuemos ......

Para la solución del punto 3 se diseño un reverse proxy en nodejs que se encarga de dirigir el tráfico a los servidores.
De esta forma si accedemos a la dirección:

- http://localhost:5000
podemos ver el sitio web
y si accedemos a:
- http://localhost:5000/resumen
obtenemos la respuesta del backend

con esto se soluciono el punto 3.
Para mayor información del diseño del reverse proxy, se puede acceder al archivo proxy/proxy-nodejs/server.js

Pendiente cubrir la parte de kubernetes (punto 4)


proximamente .....