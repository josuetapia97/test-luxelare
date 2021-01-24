FROM nginx:latest

#lo unico necesario en esta parte es copiar los archivos
# en la ruta donde nginx toma por defecto el index.html
# para este caso no necesitamos un archivo de config
# ya que por defecto jala el arhivo index.html
COPY index.html /usr/share/nginx/html
COPY index.js /usr/share/nginx/html
COPY states.geojson /usr/share/nginx/html

#estos dos ultimos comandos no son necesarios
#los ocupe solo para ver si existia conexón
#entre contenedores

RUN apt-get update
RUN apt-get install -y iputils-ping

#NOTA FINAL: no es necesario exponer el puerto ya que por defecto
#viene el puerto expuesto en la imagen nginx que se tomó 
#como base, en el puerto
