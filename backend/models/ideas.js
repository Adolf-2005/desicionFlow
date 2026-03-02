const { v4: uuidv4 } = require('uuid');
const db = require('../database/connection');

class ideasM {

  crear(datos) {
    return new Promise(async (resolve, reject) => {
      const { id_pro, titulo, descripcion, id_creador, id_usu, estado } = datos
      const sqlMiembro = 'SELECT m.id_usu FROM proyecto p INNER JOIN miembros m ON p.id_equipo = m.id_equi WHERE p.id_pro = ?'
      const sql = 'INSERT INTO decisiones (id_idea, id_pro, titulo, descripcion, id_creador, estado) VALUES (?,?,?,?,?,?)'
      const insert = [uuidv4(), id_pro, titulo, descripcion, id_creador, estado]
      try {
        const miembros = await new Promise((resolve, reject) => {
          db.query(sqlMiembro, [id_pro], function (err, res) {
            if (err) {
              return reject({ status: 500, mensaje: err })
            }
            resolve(res)
          })
        })
        const pertenece = miembros.some(m => m.id_usu === id_usu)
        if (!pertenece) {
          return reject({ status: 401, mensaje: 'No perteneces al equipo' })
        }
        db.query(sql, insert, function (err, res) {
          if (err) {
            return reject({ status: 500, mensaje: err })
          }
          resolve({ status: 200, mensaje: 'Decisión creada con éxito' })
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  editar(datos) {
    return new Promise(async (resolve, reject) => {

    })
  }

  eliminar(datos) {
    return new Promise(async (resolve, reject) => {

    })
  }

  cambiarEstado(datos) {
    return new Promise(async (resolve, reject) => {

    })
  }

}

module.exports = new ideasM();