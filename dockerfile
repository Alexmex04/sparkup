FROM node:18-bullseye

# Instalar Python y pip
RUN apt-get update && apt-get install -y python3 python3-pip


# Crear alias python -> python3
RUN ln -s /usr/bin/python3 /usr/bin/python

# Crear directorio de la app
WORKDIR /app

# Copiar e instalar dependencias Node
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install
WORKDIR /app

# Copiar dependencias Python
COPY model/requirements.txt ./model/
RUN pip3 install -r model/requirements.txt

# Copiar todo el proyecto
COPY . .


# Crear alias python -> python3
RUN ln -s /usr/bin/python3 /usr/bin/python

# Definir directorio de trabajo para Node
WORKDIR /app/backend

# Comando de inicio (levanta Node.js, que internamente llama a Python)
CMD ["node", "index.js"]