FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
# Aseguramos que todas las dependencias (incluyendo Tailwind) se instalen
RUN npm install 
COPY . .
RUN npm run build 
