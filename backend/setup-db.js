const mysql = require('mysql'); 
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Configuración de la conexión
const connection = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
});

// Ruta a tu archivo .sql
const sqlPath = path.join(__dirname, 'database/decisionflow.sql');
const sqlQuery = fs.readFileSync(sqlPath, 'utf8');

connection.connect((err) => {
  if (err) throw err;
  console.log('✅ Conectado a MySQL.');

  connection.query(sqlQuery, (error, results) => {
    if (error) {
      console.error('❌ Error al ejecutar el SQL:', error);
    } else {
      console.log('🚀 Base de datos sincronizada correctamente.');
    }
    connection.end();
  });
});