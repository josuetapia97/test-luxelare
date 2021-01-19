FROM node:12.20.1-alpine3.9

# copiamos el servidor al contenedor 
COPY ./server.js /server.js
# descargamos el modulo con el cual trabaja
# el servidor
RUN npm install express
# se ejecuta el comando para correr el servidor
# una vez el contenedor esté en ejecución
CMD ["node","server.js"]
# Permitimos el tráfico al exterior del contenedor
# por el puerto 8000
EXPOSE 8000
