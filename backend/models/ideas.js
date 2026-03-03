const { v4: uuidv4 } = require('uuid');
const db = require('../database/connection');

class ideasM {

  verificar(id_pro, id_usu) {
    return new Promise(async (resolve, reject) => {
      const sqlMiembro = 'SELECT m.id_usu FROM proyecto p INNER JOIN miembros m ON p.id_equipo = m.id_equi WHERE p.id_pro = ?'
      const sqlResponsable = 'SELECT id_responsable FROM proyecto WHERE id_pro = ?'
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
        if (!pertenece && responsable != id_usu) {
          return reject({ status: 401, mensaje: 'No perteneces al equipo' })
        }
        resolve(true);
      } catch (error) {
        reject(error)
      }

    })
  }

  crear(datos) {
    return new Promise(async (resolve, reject) => {
      const { id_pro, titulo, descripcion, id_creador, id_usu } = datos
      const sql = 'INSERT INTO ideas (id_idea, id_pro, titulo, descripcion, id_creador) VALUES (?,?,?,?,?)'
      const insert = [uuidv4(), id_pro, titulo, descripcion, id_creador]
      try {
        await this.verificar(id_pro, id_usu)
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
      const { id_pro, id_creador, id_usu, titulo, descripcion, estado, id_idea } = datos
      const sqlResponsable = 'SELECT id_responsable FROM proyecto WHERE id_pro = ?'
      let field = []
      let dataEdit = []
      if (titulo) {
        field.push('titulo=?')
        dataEdit.push(titulo)
      }
      if (descripcion) {
        field.push('descripcion=?')
        dataEdit.push(descripcion)
      }
      if (estado) {
        field.push('estado=?')
        dataEdit.push(estado)
      }
      dataEdit.push(id_idea)
      const sql = `UPDATE ideas SET ${field.join(',')} WHERE id_idea = ?`
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
        if (responsable != id_usu && id_creador != id_usu) {
          return reject({ status: 401, mensaje: 'No perteneces al equipo' })
        }
        db.query(sql, dataEdit, function (err, res) {
          if (err) {
            return reject({ status: 500, mensaje: err })
          }
          resolve({ status: 200, mensaje: 'Consulta exitosa' })
        })
      } catch (error) {
        reject(error)
      }

    })
  }

  eliminar(datos) {
    return new Promise(async (resolve, reject) => {
      const { id_creador, id_usu, id_idea, id_pro } = datos
      const sqlResponsable = 'SELECT id_responsable FROM proyecto WHERE id_pro = ?'
      const sql = 'DELETE FROM ideas WHERE id_idea = ?'
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
        if (responsable != id_usu && id_creador != id_usu) {
          return reject({ status: 401, mensaje: 'No perteneces al equipo' })
        }
        db.query(sql, [id_idea], function (err, res) {
          if (err) {
            return reject({ status: 500, mensaje: err })
          }
          if (res.affectedRows === 0) {
            return resolve({ status: 404, mensaje: 'Idea no encontrada' })
          }
          resolve({ status: 200, mensaje: 'Elimando con exito' })
        })
      } catch (error) {

      }
    })
  }

  convertirDecision(datos) {
    return new Promise(async (resolve, reject) => {
      const { id_usu, id_idea, id_pro } = datos
      const sqlResponsable = 'SELECT id_responsable FROM proyecto WHERE id_pro = ?'
      const sqlGetIdea = 'SELECT * FROM ideas WHERE id_idea = ?';
      const sqlInsertDecision = `
      INSERT INTO decisiones 
      (id_deci, id_pro, titulo, descripcion, id_creador, estado, valoracion, fecha) 
      VALUES (?, ?, ?, ?, ?, 'abierta', 0, CURRENT_TIMESTAMP)`;
      const sqlUpdateIdea = "UPDATE ideas SET estado = 'Aceptada' WHERE id_idea = ?";
      db.beginTransaction(async (err) => {
        if (err) return reject({ status: 500, mensaje: err });

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
          if (responsable != id_usu) {
            return reject({ status: 401, mensaje: 'No perteneces al equipo' })
          }
          const idea = await new Promise((res, rej) => {
            db.query(sqlGetIdea, [id_idea], (e, r) => {
              if (e) return rej(e);
              if (r.length === 0) return rej({ status: 404, mensaje: 'Idea no encontrada' });
              res(r[0]);
            });
          });
          const id_deci = uuidv4();

          await new Promise((res, rej) => {
            db.query(sqlInsertDecision, [
              id_deci,
              idea.id_pro,       // id_pro (FK)
              idea.titulo,       // titulo
              idea.descripcion,  // descripcion
              idea.id_creador    // id_creador
            ], (e) => e ? rej(e) : res());
          });
          await new Promise((res, rej) => {
            db.query(sqlUpdateIdea, [id_idea], (e) => e ? rej(e) : res());
          });

          db.commit((err) => {
            if (err) return db.rollback(() => reject({ status: 500, mensaje: err }));
            resolve({
              status: 200,
              mensaje: 'Idea convertida a decisión con éxito',
              id_decision: id_deci
            });
          });

        } catch (error) {
          db.rollback(() => {
            const status = error.status || 500;
            reject({ status, mensaje: error.mensaje || error });
          });
        }
      });
    })
  }

}

module.exports = new ideasM();