# Challenge: Mapa COVID2019

## Antecedentes

Dada la situación actual es importante contar con herramientas que nos faciliten la exploración de la información existente en nuestro país. Muchas veces las visualizaciones nos permiten facilitar la compresión o expresión de ideas complejas al plasmarlo en resúmenes, mapas, gráficas o conjuntos de ellos.

## Definiciones

### Geojson
Un archivo GEOJSON es un documento JSON en el que se almacenan objetos geográficos, por ejemplo: las coordenadas que identifica un edificio, un terreno/parcela, los límites de un estado, municipio o un punto o ubicación geográfica.

Al ser un formato estándar ya existen múltiples herramientas que te pueden ayudar a manejarlos; inclusive Leaflet puede utilizar dicho JSON y mostrar cada objeto en un mapa.

Echa un vistazo a: https://github.com/strotgen/mexico-leaflet  donde además de encontrar los GEOJSON de los municipios y estados puedes encontrar cómo implementaron su uso con leaflet.


Incluso al explorar el states.geojson, puedes observar que hay objetos con una propiedad llamada "state_name" que indica el estado que representa ese objeto. 

### Docker
Docker es una herramienta que nos permite encapsular ambientes (aplicaciones y dependencias) en contenedores y que pueden ser replicados y ejecutados en otra máquina sin mayor problema.

Simplificando muchísimo, puedes considerar que un contenedor es una máquina virtual que ejecutas e incluye: tanto la distribución de linux como los programas y librerías que especificas en un archivo (Dockerfile).

Al construir el contenedor con el arcihvo, descarga todos los archivos y binarios que necesita y crea una imagen de docker.

Al ejecutar una imagen de docker, se inicia un proceso que "levanta una máquina virtual" que tiene todo lo indicado en la construcción (en realidad utiliza algunas características de Linux para montar sobre el núcleo un proceso con los paquetes que componen una distribución en particular... pero por ahora no es tan importante).

Simplificando aun más, puedes imaginar que con docker creas "paquetes" que pueden ser ejecutados en cualquier computadora o servidor que tenga instalado docker. (Toma eso Java!)

Y pues ¿para qué nos sirve todo esto? para que no tengas que estar instalando python, java, node y todas las dependencias que necesitas, haciendo varios apt-get install, pip install, yarn add, mvn build y demás hasta dar con las versiones que necesitas para que ejecutemos correctamente tu aplicación o puedas tu ejecutar las aplicaciones de otros.

## ¡El reto!

El gobierno de la Ciudad de México cuenta con un API pública para consulta de las estadísticas de casos/contagios a nivel federal en https://datos.cdmx.gob.mx/explore/dataset/casos-asociados-a-covid-19/api/.

Por ejemplo, podemos observar una muestra de 2 registros y algunas facetas de interés
curl https://datos.cdmx.gob.mx/api/records/1.0/search/\?dataset\=casos-asociados-a-covid-19\&q\=\&rows\=2\&facet\=entidad_um\&facet\=sexo\&facet\=entidad_nac\&facet\=entidad_res\&facet\=municipio_res\&facet\=confirmados\&facet\=sospechosos\&facet\=negativos 

Dale un vistazo a la información resultante, a la información que contienen las facetas, a los filtros, etc.  Identifica si es posible obtener la información necesaria para obener una mejor idea de cuántos casos hay sospechosos, confirmados y negativos a nivel nacional. ¿cuántos por entidad? ¿qué otra información te puede ser de interés?  ¿Todo eso se puede obtener en una sola consulta al API? ¿Cuántas consultas requieres efectuar? 

0) Se requiere desarrollar un componente en el que puedas realizar una consulta HTTP a un endpoint /resumen (por ejemplo: `curl http://localhost:8000/resumen`) que entregue toda la información obtenida por el API y necesaria para el dashboard.  Para ello, tendrás que procesar esa información y obtener algunos acumulados, filtrar por algunos campos (por estado/entidad, por el resultado de la prueba de COVID19, por sexo, etcétera, tu defines los campos).

Empaqueta dicho componente en un contenedor con docker y que exponga el servicio en el puerto 8000

1) Utilizando el componente generado en el punto anterior, se necesita que desarrolles un dashboard que muestre en un mapa la información proveniente de dicho API. 

Te recomendamos que le des un vistazo a Leaflet y cómo utilizarlo para desplegar los estados, mostrarlos por colores (posiblemente mientras más intenso sea el color, sea la mayor cantidad de casos en ese estado) o marcadores que al evento del click, mostrará una pantalla con el detalle sobre un estado, etc. (y si usas React, el componente de Leaflet para react te facilita muchas cosas)

Utiliza las herramientas que conozcas o domines: Javascript, jQuery, React, Angular, Bootstrap.

2) Ya tienes tu desarrollo y posiblemente lo ejecutas con yarn start, construyes los entregables con yarn build y "pegas" la carpeta dist/build en un servidor web. Sin embargo notamos que comenzamos a tener una gran cantidad de usuarios y, como tenemos un cluster de kubernetes, nuestra solución más rápida es que empaquetes tu desarrollo en una imagen para crear varias instancias (de ese componente) en el cluster. Ésta imagen deberá ejecutarse con 

```
docker run --rm -p  9000:80 mi-imagen
```
para que pueda accederse en tu localhost:9000.

Puedes tomar como base una imagen base de nginx o un lighttpd, apache, una imagen que ejecute el yarn start o crear tu propio servidor web simple, etc.

CONSEJO: Es posible que tengas algún problema para conectarte desde un contenedor a otro, esto se debe a que cada contenedor "tiene su propio localhost". Dale un vistazo a la opción `--network host` , también te recomendamos que la configuración la establezcas en variables de ambiente.

3) Hasta este punto, ya tienes el front en el localhost:9000 y el backend en localhost:8000;  posiblemente en tu desarrollo utilizaste un proxy (http-proxy-middleware) para solucionar las restricciones de solicitudes cross-site o Same Origin Policy, con alguna configuración similar a la siguiente: 

```
app.use(
    '/backend',
    proxy({
      target: 'http://localhost:8000',
      changeOrigin: true,
      secure: false,
    })
  );
```

Pero al hacer el deploy y utilizar un servidor web simple tienes de dos: o configuras las políticas del servidor web (nginx, lighttpd) para que despache ciertas solicitudes al estilo del proxy, o creas un proxy inverso (posiblemente con el mismo middleware http-proxy-middleware) y también lo encapsulas en un contenedor.

Cualquiera que sea la forma en la que soluciones ésto, se requiere que tanto tu sitio como tu backend sean accedidos en la misma URL: localhost:5000

#### TOMA UN PEQUEÑO RESPIRO
Ya tienes las imagenes de docker y ejecutas los contenedores de manera local, ¿cómo podrías probar que funciona en el cluster?.
En realidad es casi garantía de que funcionará en el cluster. Un cluster de kubernetes nos ahorra varias cosas de configuración de red, manejo de réplicas, tolerancia a fallos (con algunos costos que obviaremos por ahora) pero que permite que un equipo "pequeño" pueda enfrentarse más fácilmente a retos con infraestructuras o empresas más grandes o que empresas más grandes puedan mejorar sus procesos y enfocar sus esfuerzos en otras áreas.

En un cluster de kubernetes existen otro tipo de "objetos" con funcionalidades adicionales a sólo levantar un proceso o agrupar algunos contenedores (codependientes) en una "máquina virtual" (Pod), definir Servicios que pueden exponerse a otros componentes del cluster y Deployments que no necesariamente exponen funcionalidades.

¿Recuerdas el show con conectarte a otros contenedores y especificar puertos? ¿Te imaginas cuando además tengas más servicios que se comuniquen entre sí y el estar definiendo puertos y puertos? Ah pues cuando creas un servicio, por ejemplo alguno llamado: servidor-covid con la imagen de docker definida anteriormente: 'covid-api', expones a cualquier otro componente del cluster ese servicio con ese nombre en el DNS interno, entonces en lugar de configurar tu proxy a que llame a http://localhost:8000 , los demás objetos que vivan en el cluster pueden hacerlo con http://servidor-covid/, para ello necesitas darle un vistazo a kubernetes.

#### El último punto del reto es:

Ya que un cluster de kubernetes (de a deveras) requiere que: configures más cosas, tengas dos o más servidores, configures un maestro, los trabajadores (nodos) y es un poco engorroso; la recomendación es que le des un vistazo al proyecto kind (https://kind.sigs.k8s.io/docs/user/quick-start/) y puedas jugar un poco con ello. Kind te crea un cluster "virtual" en tu equipo local.

Para interactuar con el cluster de kubernetes se requiere de la herramienta kubectl. una vez instalada puedes ejecutar comandos del tipo 
```
kubectl get namespaces
kubectl get pod
kubectl get services
kubectl apply -f servicios.yaml
```

4) Entonces con todo lo que has hecho anteriormente, monta los contenedores creados en el cluster: Ya que los componentes (el servidores web del front, el backend y posiblemente el proxy externo que hayas creado para el punto 3) exponen puertos a los cuales pueden hacerse solicitudes, se requieren crear Servicios (y definirlos en un archivo YAML).

Al final en el cluster deberás tener montados un servicio 'covid-api', otro 'covid-frontend' y posiblemente un 'covid-proxy' que se conectaría a los dos anteriores, en lugar de con http://localhost:8000 o 9000, a  http://covid-api, http://covid-frontend respectivamente (SÓLO DENTRO DEL CLUSTER).

Puedes hacer un puente al puerto de algún servicio con un comando similar a éste
```
kubectl port-forward service/covid-backend 8000:8000 -n nombre_namespace
```
o conectarte al shell de algun pod/contenedor con
```
kubectl exec -it service/covid-backend -n nombre_namespace -- bash   (o sh)
``` 
