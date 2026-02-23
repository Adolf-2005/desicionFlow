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
            const equipos = res
            if (res.length) {
              equipos.forEach(e => {
                e.miembros = miembros.data.filter(m => m.id_equi == e.id_equi);
              });
              resolve({ status: 200, mensaje: 'Exito de consulta', equipos: equipos })
            } else {
              resolve({ mensaje: 'No hay equipos para mostrar', equipos: equipos, status: 200 })
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
      console.log(datos)
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
      const { id_equi, nombre, descripcion, id_responsable, miembros } = datos;

      db.beginTransaction(async (err) => {
        if (err) return reject({ mensaje: err, status: 500 });

        try {
          const sqlUpdateEquipo = 'UPDATE equipos SET nombre = ?, descripcion = ?, id_responsable = ? WHERE id_equi = ?';
          await new Promise((resolve, reject) => {
            db.query(sqlUpdateEquipo, [nombre, descripcion, id_responsable, id_equi], (err) => {
              if (err) return reject(err);
              resolve();
            });
          });
          const miembrosActuales = await new Promise((resolve, reject) => {
            db.query('SELECT id_usu FROM miembros WHERE id_equi = ?', [id_equi], (err, res) => {
              if (err) return reject(err);
              resolve(res.map(m => m.id_usu));
            });
          });
          const idsNuevos = miembros.map(m => m.id_usu);
          const aEliminar = miembrosActuales.filter(id => !idsNuevos.includes(id));
          const aInsertar = miembros.filter(m => !miembrosActuales.includes(m.id_usu));
          if (aEliminar.length > 0) {
            await new Promise((resolve, reject) => {
              db.query('DELETE FROM miembros WHERE id_equi = ? AND id_usu IN (?)', [id_equi, aEliminar], (err) => {
                if (err) return reject(err);
                resolve();
              });
            });
          }
          if (aInsertar.length > 0) {
            const sqlInsert = 'INSERT INTO miembros (id_equi, id_usu, rol) VALUES ?';
            const valores = aInsertar.map(m => [id_equi, m.id_usu, m.rol]);
            await new Promise((resolve, reject) => {
              db.query(sqlInsert, [valores], (err) => {
                if (err) return reject(err);
                resolve();
              });
            });
          }
          const permanecen = miembros.filter(m => miembrosActuales.includes(m.id_usu));
          for (const m of permanecen) {
            await new Promise((resolve, reject) => {
              db.query('UPDATE miembros SET rol = ? WHERE id_equi = ? AND id_usu = ?', [m.rol, id_equi, m.id_usu], (err) => {
                if (err) return reject(err);
                resolve();
              });
            });
          }
          db.commit((err) => {
            if (err) throw err;
            resolve({ mensaje: 'Equipo actualizado con éxito', status: 200 });
          });

        } catch (error) {
          db.rollback(() => reject({ mensaje: 'Error en actualización', error, status: 500 }));
        }
      });
    });
  }

  elimiar(id_equi) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM equipos WHERE id_equi = ?'
      if (!id_equi) {
        return reject({ status: 404, mensaje: 'Datos incompletos' })
      }
      db.query(sql, [id_equi], function (err, res) {
        if (err) {
          return reject({ status: 500, mensaje: err })
        }
        if (res.affectedRows === 0) {
          return reject({ status: 404, mensaje: 'Equipo no encontrado' })
        }
        resolve({ status: 200, mensaje: 'Equipo eliminado con éxito' })
      })
    })
  }

  elimiarMiembro(datos) {
    return new Promise((resolve, reject) => {
      const { id_usu, id_equi } = datos
      const sql = 'DELETE FROM miembros WHERE id_usu = ? AND id_equi = ?'
      if (!id_usu) {
        return reject({ status: 404, mensaje: 'Datos incompletos' })
      }
      db.query(sql, [id_usu, id_equi], function (err, res) {
        if (err) {
          return reject({ status: 500, mensaje: err })
        }
        if (res.affectedRows === 0) {
          return reject({ status: 404, mensaje: 'Miembro no encontrado' })
        }
        resolve({ status: 200, mensaje: 'Miembro eliminado con éxito' })
      })
    })
  }

}

module.exports = new equipoM();