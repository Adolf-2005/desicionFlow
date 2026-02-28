const { v4: uuidv4 } = require('uuid');
const db = require('../database/connection');

class decisionesM {

  crear(datos) {
    return new Promise(async (resolve, reject) => {
      const { id_pro, titulo, descripcion, id_creador, id_usu, estado, impacto, observacion } = datos
      const sqlMiembro = 'SELECT m.id_usu FROM proyecto p INNER JOIN miembros m ON p.id_equipo = m.id_equi WHERE p.id_pro = ?'
      const sql = 'INSERT INTO decisiones (id_deci, id_pro, titulo, descripcion, id_creador, estado, impacto, observacion) VALUES (?,?,?,?,?,?,?,?)'
      const sqlResponsable = 'SELECT id_responsable FROM proyecto WHERE id_pro = ?'
      const insert = [uuidv4(), id_pro, titulo, descripcion, id_creador, estado, impacto, observacion]
      try {
        const miembros = await new Promise((resolve, reject) => {
          db.query(sqlMiembro, [id_pro], function (err, res) {
            if (err) {
              return reject({ status: 500, mensaje: err })
            }
            resolve(res)
          })
        })
        const responsable = await new Promise((resolve, reject) => {
          db.query(sqlResponsable, [id_pro], function (err, res) {
            if (err) {
              return reject({ status: 500, mensaje: err })
            }
            if (res.length === 0) {
              return resolve({ status: 404, mensaje: 'Decisión no encontrado' })
            }
            resolve(res[0].id_responsable)
          })
        })
        const pertenece = miembros.some(m => m.id_usu === id_usu)
        if (!pertenece) {
          return reject({ status: 401, mensaje: 'No perteneces al equipo' })
        }
        if (responsable != id_usu) {
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
      const { id_deci, titulo, descripcion, estado, impacto, observacion, id_usu, id_pro } = datos
      const sql = 'UPDATE decisiones SET titulo=?, descripcion=?, estado=?, impacto=?, observacion=? WHERE id_deci = ?'
      const sqlCreador = 'SELECT id_creador FROM decisiones WHERE id_deci = ?'
      const sqlResponsable = 'SELECT id_responsable FROM proyecto WHERE id_pro = ?'
      const edit = [titulo, descripcion, estado, impacto, observacion, id_deci]
      try {
        const creador = await new Promise((resolve, reject) => {
          db.query(sqlCreador, [id_deci], function (err, res) {
            if (err) {
              return reject({ status: 500, mensaje: err })
            }
            if (res.length === 0) {
              return resolve({ status: 404, mensaje: 'Decisión no encontrado' })
            }
            resolve(res[0].id_creador)
          })
        })
        const responsable = await new Promise((resolve, reject) => {
          db.query(sqlResponsable, [id_pro], function (err, res) {
            if (err) {
              return reject({ status: 500, mensaje: err })
            }
            if (res.length === 0) {
              return resolve({ status: 404, mensaje: 'Decisión no encontrado' })
            }
            resolve(res[0].id_responsable)
          })
        })
        if (responsable != id_usu && creador != id_usu) {
          return reject({ status: 401, mensaje: 'No tienes permisos para realizar esta acción' })
        }
        db.query(sql, edit, function (err, res) {
          if (err) {
            return reject({ status: 500, mensaje: err })
          }
          resolve({ status: 200, mensaje: 'Decisión editada con éxito' })
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  eliminar(datos) {
    return new Promise(async(resolve, reject) => {
      const { id_deci, id_pro, id_usu } = datos
      const sql = 'DELETE FROM decisiones WHERE id_deci = ?'
      const sqlCreador = 'SELECT id_creador FROM decisiones WHERE id_deci = ?'
      const sqlResponsable = 'SELECT id_responsable FROM proyecto WHERE id_pro = ?'
      try {
        const creador = await new Promise((resolve, reject) => {
          db.query(sqlCreador, [id_deci], function (err, res) {
            if (err) {
              return reject({ status: 500, mensaje: err })
            }
            if (res.length === 0) {
              return resolve({ status: 404, mensaje: 'Decisión no encontrado' })
            }
            resolve(res[0].id_creador)
          })
        })
        const responsable = await new Promise((resolve, reject) => {
          db.query(sqlResponsable, [id_pro], function (err, res) {
            if (err) {
              return reject({ status: 500, mensaje: err })
            }
            if (res.length === 0) {
              return resolve({ status: 404, mensaje: 'Decisión no encontrado' })
            }
            resolve(res[0].id_responsable)
          })
        })
        if (responsable != id_usu && creador != id_usu) {
          return reject({ status: 401, mensaje: 'No tienes permisos para realizar esta acción' })
        }
        db.query(sql, [id_deci], function (err, res) {
          if (err) {
            return reject({ status: 500, mensaje: err })
          }
          if (res.affectedRows === 0) {
            return resolve({ status: 404, mensaje: 'Decisión no encontrado' })
          }
          resolve({ status: 200, mensaje: 'Decisión eliminada con éxito' })
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  cambiarEstado(datos) {
    return new Promise(async (resolve, reject) => {
      const { id_deci, estado, resultados, id_usu, id_pro } = datos
      let field = []
      let info = []
      if (estado) {
        field.push('estado = ?')
        info.push(estado)
      }
      if (resultados) {
        field.push('resultado = ?')
        info.push(resultados)
      }
      info.push(id_deci)
      const sql = `UPDATE decisiones SET ${field.join(',')} WHERE id_deci = ?`
      const sqlCreador = 'SELECT id_creador FROM decisiones WHERE id_deci = ?'
      const sqlResponsable = 'SELECT id_responsable FROM proyecto WHERE id_pro = ?'
      try {
        const creador = await new Promise((resolve, reject) => {
          db.query(sqlCreador, [id_deci], function (err, res) {
            if (err) {
              return reject({ status: 500, mensaje: err })
            }
            if (res.length === 0) {
              return resolve({ status: 404, mensaje: 'Decisión no encontrado' })
            }
            resolve(res[0].id_creador)
          })
        })
        const responsable = await new Promise((resolve, reject) => {
          db.query(sqlResponsable, [id_pro], function (err, res) {
            if (err) {
              return reject({ status: 500, mensaje: err })
            }
            if (res.length === 0) {
              return resolve({ status: 404, mensaje: 'Decisión no encontrado' })
            }
            resolve(res[0].id_responsable)
          })
        })
        if (responsable != id_usu && creador != id_usu) {
          return reject({ status: 401, mensaje: 'No tienes permisos para realizar esta acción' })
        }
        db.query(sql, info, function (err, res) {
          if (err) {
            return reject({ status: 500, mensaje: err })
          }
          if (res.affectedRows === 0) {
            return resolve({ status: 404, mensaje: 'Decisión no encontrado' })
          }
          resolve({ status: 200, mensaje: 'Estado cambiado con éxito' })
        })
      } catch (error) {
        reject(error)
      }
    })
  }

}

module.exports = new decisionesM();