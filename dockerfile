FROM node:18-bullseye

# Instalar Python 3 y pip
RUN apt-get update && apt-get install -y python3 python3-pip

# Crear alias python -> python3
RUN ln -sf /usr/bin/python3 /usr/bin/python

# Crear directorio de la app
WORKDIR /app

# Copiar package.json e instalar dependencias Node
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

# Volver a la raíz
WORKDIR /app

# Copiar dependencias Python y instalar
COPY model/requirements.txt ./model/
RUN pip3 install -r model/requirements.txt

# Copiar todo el proyecto
COPY . .

# Establecer WORKDIR para Node
WORKDIR /app/backend

# Puerto dinámico de Render
ENV PORT 5000

# Comando de inicio
CMD ["node", "index.js"]
