

FROM node:12.20.1-alpine3.9
# Se crea una ruta en donde se va a trabajar
WORKDIR /usr/src/app

#se copia el servidor al container
COPY ./server.js ./server.js

#se instalan las dependencias necesarias
RUN npm install express
RUN npm install http-proxy-middleware
#se instala curl para ver la comunicacion dentro del cluster
#no es necesario este paso, se puede instalar directamente del shell
#del container
RUN apk add curl

#permitimos el trafico del coontenedor por medio del puerto 5000
EXPOSE 5000
#una vez que arranque el contenedor, se corre el proxy
CMD [ "node", "server.js" ]

