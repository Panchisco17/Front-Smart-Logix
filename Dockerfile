# Usa una imagen ligera de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente del frontend
COPY . .

# Expone el puerto por defecto de Vite
EXPOSE 5173

# Comando para iniciar Vite, permitiendo conexiones externas (--host)
CMD ["npm", "run", "dev", "--", "--host"]