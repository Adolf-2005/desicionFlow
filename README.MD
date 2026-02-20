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
```

🚀 Guía de Instalación y Despliegue
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
3. Ejecución en desarrollo
Inicia el servidor con soporte para recarga automática:
```
cmd
npm run serve
```