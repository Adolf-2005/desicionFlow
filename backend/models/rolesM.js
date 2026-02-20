const { v4: uuidv4 } = require('uuid');
const db = require('../database/connection')

class rolesM {

  roles() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM roles'
      db.query(sql, function (err, res) {
        if (err) {
          return reject({ status: 500, mensaje: err })
        }
        if (!res.length) {
          return resolve({ status: 200, mensaje: 'No hay roles registrados' })
        }
        resolve({ status: 200, mensaje: 'roles consultados con éxito', roles: res })
      })
    })
  }

  crear(nombre) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO roles (id_rol, nombre) VALUES (?,?)'
      db.query(sql, [uuidv4(), nombre], function (err, res) {
        if (err) {
          return reject({ status: 500, mensaje: err })
        }
        resolve({ status: 200, mensaje: 'Rol creado con éxito' })
      })
    })
  }

  editar(datos) {
    return new Promise((resolve, reject) => {
      const { nombre, id_rol } = datos
      const sql = 'UPDATE roles SET nombre = ? WHERE id_rol = ?'
      db.query(sql, [nombre, id_rol], function (err, res) {
        if (err) {
          return reject({ status: 500, mensaje: err })
        }
        if (res.affectedRows === 0) {
          return resolve({status:404, mensaje:'Rol no encontrado'})
        }
        resolve({ status: 200, mensaje: 'Rol editado con éxito'})
      })
    })
  }

}

module.exports = new rolesM();