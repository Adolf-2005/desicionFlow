# 🚀 DecisionFlow - Backend

Bienvenido al repositorio del Backend de **DecisionFlow**. Este servicio maneja la lógica de negocio, la persistencia de datos y la API central del sistema.

---

## 🛠️ Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu entorno local:
* [Node.js](https://nodejs.org/) (Versión 16.x o superior)
* [npm](https://www.npmjs.com/)
* Una instancia de MySQL activa.

---

## ⚙️ Configuración del Entorno

Para que el servidor funcione correctamente, es necesario configurar las variables de entorno. 

1. Ubícate en la carpeta del backend.
2. Crea un archivo llamado `.env`.
3. Copia el siguiente bloque de código y asegúrate de que coincida con tus credenciales locales:

```env
DB_HOST = 'localhost'
DB_USER = 'root'
DB_PASSWORD = ''
DB_DATABASE = 'decisionflow'
JSONWEBTOKEN = 'SHHHH'
PORTCORS = http://localhost:5000
PATH_DOCUMENT = http://localhost:3000/uploads/documents/
PATH_IMAGEN = http://localhost:3000/uploads/images/

```

🚀 Guía de Instalación, Despliegue y base de datos
Sigue estos pasos en tu terminal para poner el servidor en funcionamiento:

1. Acceder al directorio
Navega a la carpeta específica del backend:

```
cmd
cd ./backend
```
2. Instalación de dependencias
Descarga e instala todos los módulos necesarios definidos en el ```package.json:```
```
cmd
npm i
```
3. Instalación de base de datos
Debes tener xampp en ejecución y en la consola de backend ejecutar el siguien comando
```
cmd
npm run db:setup
```
4. Ejecución en desarrollo
Inicia el servidor con soporte para recarga automática:
```
cmd
npm run serve
```

# 🎨 DecisionFlow - Frontend

Bienvenido al repositorio del Frontend de **DecisionFlow**. Esta interfaz está construida con **Vue.js** y se encarga de proporcionar una experiencia de usuario fluida e interactiva para la gestión de flujos de decisión.

---

## 🛠️ Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu entorno local:
* [Node.js](https://nodejs.org/) (Versión 16.x o superior)
* [npm](https://www.npmjs.com/)
* Tener el **Backend de DecisionFlow** configurado y en ejecución.

---

## ⚙️ Configuración del Entorno

Para que la aplicación se comunique correctamente con la API, es necesario configurar las variables de entorno.

1. Ubícate en la carpeta del frontend: `cd ./frontend`.
2. Crea un archivo llamado `.env`.
3. Copia el siguiente bloque de código. **Importante:** En Vue con VITE, las variables deben comenzar con `VITE_` para que sean accesibles en el cliente.

```env
# URL de la API del Backend
VITE_BACKEND_URL = http://localhost:3000

# Rutas para recursos multimedia
VITE_PATH_DOCUMENT = http://localhost:3000/uploads/documents/
VITE_PATH_IMAGEN = http://localhost:3000/uploads/images/
```

🚀 Guía de Instalación y Despliegue
Sigue estos pasos en tu terminal para poner el servidor en funcionamiento:

1. Acceder al directorio
Navega a la carpeta específica del frontend:

```
cmd
cd ./frontend
```
2. Instalación de dependencias
Descarga e instala todos los módulos necesarios definidos en el ```package.json:```
```
cmd
npm i
```
3. Ejecución en desarrollo
Inicia el servidor con soporte para recarga automática:
```
cmd
npm run serve
```