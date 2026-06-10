# ETAPA 1: Construcción (Builder)
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
COPY vite.config.js ./
RUN npm install
COPY . .
# Se compila el código para producción (Adiós al npm run dev)
RUN npm run build 

# ETAPA 2: Servidor de Producción (Nginx)
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80