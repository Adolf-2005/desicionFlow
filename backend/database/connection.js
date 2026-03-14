require('dotenv').config();
const mysql = require('mysql2/promise');

// Usamos createPool en lugar de createConnection
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  // ssl: {
  //   rejectUnauthorized: false
  // },
  connectionLimit: 10,
  waitForConnections: true,
  queueLimit: 0
});

// Verificación de conexión inicial
(async () => {
  try {
    const conn = await connection.getConnection();
    console.log('✅ Conexión exitosa al Pool de MySQL');
    conn.release(); // Muy importante liberar la conexión
  } catch (err) {
    console.error('❌ Error al conectar la base de datos: ' + err.message);
  }
})();

module.exports = connection;