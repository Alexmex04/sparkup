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

# Instalar dependencias Python (desde backend/model/requirements.txt)
COPY backend/model/requirements.txt ./model/
RUN pip3 install -r ./model/requirements.txt

# Copiar todo el proyecto
WORKDIR /app
COPY . .

# Establecer WORKDIR para Node
WORKDIR /app/backend

# Comando de inicio
CMD ["node", "index.js"]
