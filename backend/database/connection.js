require('dotenv').config();
const mysql = require('mysql2/promise');

// Usamos createPool en lugar de createConnection
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  },
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0
});

// Verificación de conexión inicial
connection.getConnection((err, connection) => {
  if (err) {
    console.error('Error al conectar la base de datos: ' + err.message);
    return;
  }
  if (connection) {
    console.log('Conexión exitosa al Pool de MySQL');
    connection.release(); // Devuelve la conexión al pool
  }
});

module.exports = connection;