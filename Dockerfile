# Etapa de construcción
FROM node:20-alpine as builder
WORKDIR /app

# Copiamos solo los archivos de dependencias primero para aprovechar el caché de Docker
COPY package*.json ./
RUN npm install

# Copiamos TODO el código fuente ahora
COPY . .

# Construimos la aplicación
RUN npm run build 

# Etapa de producción
FROM nginx:alpine
# Copiamos la configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copiamos los archivos compilados desde la etapa anterior
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]