

FROM node:12.20.1-alpine3.9
#creamos una ruta donde vamos a trabajar
WORKDIR /usr/src/app

#copiamos el servidor al contenedor
COPY ./server.js ./server.js

#instalamos las dependencias 
RUN npm install express
RUN npm install http-proxy-middleware


#permitimos el trafico del coontenedor por medio del puerto 5000
EXPOSE 5000
CMD [ "node", "server.js" ]

