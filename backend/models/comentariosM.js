const { v4: uuidv4 } = require('uuid');
const db = require('../database/connection');

class comentariosM {

  crearComentario(datos) {
    return new Promise(async (resolve, reject) => {
      const { puntaje, comentario, id_deci, id_usu, id_pro } = datos
      const sqlMiembro = 'SELECT m.id_usu FROM proyecto p INNER JOIN miembros m ON p.id_equipo = m.id_equi WHERE p.id_pro = ?'
      const sqlResponsable = 'SELECT id_responsable FROM proyecto WHERE id_pro = ?'
      const sql = 'INSERT INTO valoracion_dec (id_val, puntaje, id_creador, id_deci) VALUES (?,?,?,?)'
      const sqlComentario = 'INSERT INTO comentarios_dec (id_val, comentario) VALUES (?,?)'
      const sqlPuntaje = 'SELECT valoracion FROM decisiones WHERE id_deci = ?'
      const sqlPuntajeInsert = 'UPDATE decisiones SET valoracion = ? WHERE id_deci = ?'
      const id_val = uuidv4()
      const insert = [id_val, puntaje, id_usu, id_deci]
      const comentarioInsert = [id_val, comentario]
      db.beginTransaction(async (err) => {
        if (err) {
          return reject(err)
        }
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
          const pertenece = miembros.some(m => m.id_usu === String(id_usu))
          if ((!pertenece) && (responsable != id_usu)) {
            return reject({ status: 401, mensaje: 'No perteneces al equipo' })
          }
          const count = await new Promise((resolve, reject) => {
            db.query(sqlPuntaje, [id_deci], function (err, res) {
              if (err) {
                db.rollback(() => reject({ mensaje: err, status: 500 }));
                return reject({ status: 500, mensaje: err })
              }
              if (res.length === 0) {
                return resolve({ status: 404, mensaje: 'Decisión no encontrado' })
              }
              resolve(res[0].valoracion)
            })
          })
          let valoracionFinal = parseFloat(count) + parseFloat(puntaje)
          const modificarVal = await new Promise((resolve, reject) => {
            db.query(sqlPuntajeInsert, [valoracionFinal, id_deci], function (err, res) {
              if (err) {
                db.rollback(() => reject({ mensaje: err, status: 500 }));
                return reject({ status: 500, mensaje: err })
              }
              resolve({ status: 200 })
            })
          })
          if (modificarVal.status != 200) {
            return reject(modificarVal)
          }
          const valoracionNueva = await new Promise((resolve, reject) => {
            db.query(sql, insert, function (err, res) {
              if (err) {
                db.rollback(() => reject({ mensaje: err, status: 500 }));
                return reject({ status: 500, mensaje: err })
              }
              resolve({ status: 200 })
            })
          })
          if (valoracionNueva.status != 200) {
            return reject(valoracionNueva)
          }
          const comentarioNuevo = await new Promise((resolve, reject) => {
            db.query(sqlComentario, comentarioInsert, function (err, res) {
              if (err) {
                db.rollback(() => reject({ mensaje: err, status: 500 }));
                return reject({ status: 500, mensaje: err })
              }
              resolve({ status: 200, mensaje: 'Comentario creado con exito' })
            })
          })
          if (comentarioNuevo.status != 200) {
            return reject(comentarioNuevo)
          }
          db.commit((err) => {
            if (err) {
              return db.rollback(() => reject({ status: 500, mensaje: err }));
            }
            resolve({ status: 200, mensaje: 'Comentario creado con éxito' });
          });
        } catch (error) {
          reject(error)
        }
      })
    })
  }

  crearComentarioIdea(datos) {
    return new Promise(async (resolve, reject) => {
      const { puntaje, comentario, id_idea, id_usu, id_pro } = datos
      const sqlMiembro = 'SELECT m.id_usu FROM proyecto p INNER JOIN miembros m ON p.id_equipo = m.id_equi WHERE p.id_pro = ?'
      const sqlResponsable = 'SELECT id_responsable FROM proyecto WHERE id_pro = ?'
      const sql = 'INSERT INTO valoracion_idea (id_val, puntaje, id_creador, id_idea) VALUES (?,?,?,?)'
      const sqlComentario = 'INSERT INTO comentarios_idea (id_val, comentario) VALUES (?,?)'
      const sqlPuntaje = 'SELECT valoracion FROM ideas WHERE id_idea = ?'
      const sqlPuntajeInsert = 'UPDATE ideas SET valoracion = ? WHERE id_idea = ?'
      const id_val = uuidv4()
      const insert = [id_val, puntaje, id_usu, id_idea]
      const comentarioInsert = [id_val, comentario]
      db.beginTransaction(async (err) => {
        if (err) {
          return reject(err)
        }
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
          const pertenece = miembros.some(m => m.id_usu === String(id_usu))
          if ((!pertenece) && (responsable != id_usu)) {
            return reject({ status: 401, mensaje: 'No perteneces al equipo' })
          }
          const count = await new Promise((resolve, reject) => {
            db.query(sqlPuntaje, [id_idea], function (err, res) {
              if (err) {
                db.rollback(() => reject({ mensaje: err, status: 500 }));
                return reject({ status: 500, mensaje: err })
              }
              if (res.length === 0) {
                return resolve({ status: 404, mensaje: 'Decisión no encontrado' })
              }
              resolve(res[0].valoracion)
            })
          })
          let valoracionFinal = parseFloat(count) + parseFloat(puntaje)
          const modificarVal = await new Promise((resolve, reject) => {
            db.query(sqlPuntajeInsert, [valoracionFinal, id_idea], function (err, res) {
              if (err) {
                db.rollback(() => reject({ mensaje: err, status: 500 }));
                return reject({ status: 500, mensaje: err })
              }
              resolve({ status: 200 })
            })
          })
          if (modificarVal.status != 200) {
            return reject(modificarVal)
          }
          const valoracionNueva = await new Promise((resolve, reject) => {
            db.query(sql, insert, function (err, res) {
              if (err) {
                db.rollback(() => reject({ mensaje: err, status: 500 }));
                return reject({ status: 500, mensaje: err })
              }
              resolve({ status: 200 })
            })
          })
          if (valoracionNueva.status != 200) {
            return reject(valoracionNueva)
          }
          const comentarioNuevo = await new Promise((resolve, reject) => {
            db.query(sqlComentario, comentarioInsert, function (err, res) {
              if (err) {
                db.rollback(() => reject({ mensaje: err, status: 500 }));
                return reject({ status: 500, mensaje: err })
              }
              resolve({ status: 200, mensaje: 'Comentario creado con exito' })
            })
          })
          if (comentarioNuevo.status != 200) {
            return reject(comentarioNuevo)
          }
          db.commit((err) => {
            if (err) {
              return db.rollback(() => reject({ status: 500, mensaje: err }));
            }
            resolve({ status: 200, mensaje: 'Comentario creado con éxito' });
          });
        } catch (error) {
          reject(error)
        }
      })
    })
  }


  eliminarComDec(datos) {
    return new Promise(async (resolve, reject) => {
      const { id_com_dec, id_usu, id_pro } = datos
      const sqlVal = 'SELECT c.id_val, d.valoracion, v.puntaje, v.id_creador, d.id_deci FROM comentarios_dec c INNER JOIN valoracion_dec v ON c.id_val = v.id_val INNER JOIN decisiones d ON d.id_deci = v.id_deci WHERE c.id_com_dec = ?'
      const sqlEdit = 'UPDATE valoracion_dec SET valoracion = ? WHERE id_deci = ?'
      const sql = 'DELETE FROM comentarios_dec WHERE id_com_dec = ?'
      const sqlResponsable = 'SELECT id_responsable FROM proyecto WHERE id_pro = ?'
      try {
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
        const comentariosDatos = await new Promise((resolve, reject) => {
          db.query(sqlVal, [id_com_dec], function (err, res) {
            if (err) {
              return reject({ status: 500, mensaje: err })
            }
            if (res.length === 0) {
              return resolve({ status: 404, mensaje: 'Decisión no encontrado' })
            }
            resolve(res[0])
          })
        })
        if (responsable != id_usu && comentariosDatos.id_creador != id_usu) {
          return reject({ status: 401, mensaje: 'No tienes permisos para realizar esta acción' })
        }
        let valoracionFinal = parseFloat(comentariosDatos.valoracion) - parseFloat(comentariosDatos.puntaje)
        const valoracionEditada = await new Promise((resolve, reject) => {
          db.query(sqlEdit, [valoracionFinal, comentariosDatos.id_deci], function (err, res) {
            if (err) {
              return reject({ status: 500, mensaje: err })
            }
            if (res.affectedRows === 0) {
              return resolve({ status: 404, mensaje: 'Decisión no encontrado' })
            }
            resolve({ status: 200 })
          })
        })
        if (valoracionEditada.status != 200) {
          return reject(valoracionEditada)
        }
        db.query(sql, [id_com_dec], function (err, res) {
          if (err) {
            return reject({ status: 500, mensaje: err })
          }
          if (res.affectedRows === 0) {
            return resolve({ status: 404, mensaje: 'Comentario no encontrado' })
          }
          resolve({ status: 200, mensaje: 'Comentario eliminado con éxito' })
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  eliminarComIdea(datos) {
    return new Promise(async (resolve, reject) => {
      const { id_com_dec, id_usu, id_pro } = datos
      const sqlVal = 'SELECT c.id_val, i.valoracion, v.puntaje, v.id_creador, i.id_idea FROM comentarios_idea c INNER JOIN valoracion_idea v ON c.id_val = v.id_val INNER JOIN ideas i ON i.id_idea = v.id_idea WHERE c.id_com_idea = ?'
      const sqlEdit = 'UPDATE valoracion_idea SET valoracion = ? WHERE id_idea = ?'
      const sql = 'DELETE FROM comentarios_idea WHERE id_com_idea = ?'
      const sqlResponsable = 'SELECT id_responsable FROM proyecto WHERE id_pro = ?'
      try {
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
        const comentariosDatos = await new Promise((resolve, reject) => {
          db.query(sqlVal, [id_com_dec], function (err, res) {
            if (err) {
              return reject({ status: 500, mensaje: err })
            }
            if (res.length === 0) {
              return resolve({ status: 404, mensaje: 'Decisión no encontrado' })
            }
            resolve(res[0])
          })
        })
        if (responsable != id_usu && comentariosDatos.id_creador != id_usu) {
          return reject({ status: 401, mensaje: 'No tienes permisos para realizar esta acción' })
        }
        let valoracionFinal = parseFloat(comentariosDatos.valoracion) - parseFloat(comentariosDatos.puntaje)
        const valoracionEditada = await new Promise((resolve, reject) => {
          db.query(sqlEdit, [valoracionFinal, comentariosDatos.id_idea], function (err, res) {
            if (err) {
              return reject({ status: 500, mensaje: err })
            }
            if (res.affectedRows === 0) {
              return resolve({ status: 404, mensaje: 'Decisión no encontrado' })
            }
            resolve({ status: 200 })
          })
        })
        if (valoracionEditada.status != 200) {
          return reject(valoracionEditada)
        }
        db.query(sql, [id_com_dec], function (err, res) {
          if (err) {
            return reject({ status: 500, mensaje: err })
          }
          if (res.affectedRows === 0) {
            return resolve({ status: 404, mensaje: 'Comentario no encontrado' })
          }
          resolve({ status: 200, mensaje: 'Comentario eliminado con éxito' })
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

module.exports = new comentariosM();