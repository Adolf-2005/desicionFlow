const { v4: uuidv4 } = require('uuid');
const db = require('../database/connection');

class equipoM {

  miembros() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT id_usu, nombre, apellido, usuario, cedula FROM usuarios WHERE rol = ?'
      db.query(sql, ['Miembro'], function (err, res) {
        if (err) {
          return reject({ status: 500, mensaje: err })
        }
        resolve({ status: 200, mensaje: 'Exito de consulta', miembros: res })
      })
    })
  }

  equipos() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM equipos'
      const sqlMiembro = 'SELECT m.id_equi, m.id_usu, m.rol, m.fecha_ingreso, u.nombre, u.apellido, u.usuario, u.cedula FROM miembros m INNER JOIN usuarios u ON u.id_usu = m.id_usu'
      db.beginTransaction(async (err) => {
        if (err) {
          return reject(err)
        }
        try {
          const miembros = await new Promise((resolve, reject) => {
            db.query(sqlMiembro, function (err, res) {
              if (err) {
                return reject({ status: 500, mensaje: err })
              }
              resolve({ status: 200, mensaje: 'Exito de consulta', data: res })
            })
          })
          db.query(sql, function (err, res) {
            if (err) {
              return reject({ status: 500, mensaje: err })
            }
            if (res.length) {
              const equipos = res
              equipos.forEach(e => {
                e.miembros = miembros.data.filter(m => m.id_equi == e.id_equi);
              });
              resolve({ status: 200, mensaje: 'Exito de consulta', equipos: equipos })
            } else {
              resolve({ mensaje: 'No hay equipos para mostrar', status: 200 })
            }
          })
        } catch (error) {
          reject({ status: 500, mensaje: error })
        }
      })
    })
  }

  crear(datos) {
    return new Promise((resolve, reject) => {
      const { nombre, descripcion, id_responsable, miembros } = datos
      const sql = 'INSERT INTO equipos (id_equi, nombre, descripcion, id_responsable) VALUES (?,?,?,?)'
      const sqlMiembro = 'INSERT INTO miembros (id_equi, id_usu, rol) VALUES ?'
      const id = uuidv4()
      const insert = [id, nombre, descripcion, id_responsable]
      let lista = []
      db.beginTransaction(async (err) => {
        if (err) { return reject({ mensaje: err, status: 500 }) }
        try {
          await new Promise((resolve, reject) => {
            db.query(sql, insert, function (err, res) {
              if (err) {
                return reject({ mensaje: err, status: 500 })
              }
              resolve({ mensaje: 'Equipo creado con exito', data: insert, status: 201 })
            })
          })
          for (const m of miembros) {
            lista.push([id, m.id_usu, m.rol])
          }
          await new Promise((resolve, reject) => {
            db.query(sqlMiembro, [lista], function (err, res) {
              if (err) {
                return db.rollback(function () {
                  return reject({ mensaje: err, status: 500 })
                });
              }
              resolve({ mensaje: 'Exito', status: 201 })
            })
          })
          db.commit(function (err) {
            if (err) {
              return db.rollback(function () {
                return reject({ mensaje: err, status: 500 })
              });
            }
          });
          resolve({ mensaje: 'Equipo creado con exito', status: 201 })
        } catch (error) {
          db.rollback(function () {
            return reject(error)
          })
        }
      })
    })
  }

  editar(datos) {
    return new Promise((resolve, reject) => {

    })
  }

}

module.exports = new equipoM();