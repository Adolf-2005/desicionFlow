const { v4: uuidv4 } = require('uuid');
const db = require('../database/connection')
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config()


class proyectoM {

  todos() {
    return new Promise((resolve, reject) => {
      const sql = `SELECT p.id_pro, p.nombre AS nom_pro, p.descripcion AS des_pro, p.id_equipo, e.nombre AS nom_equi, e.descripcion AS des_equi, p.id_responsable, CONCAT(u.nombre, ' ', u.apellido) AS nom_lider, u.usuario, p.estado, p.fecha_creacion, p.fecha_inicio, p.fecha_cierre, p.documento, p.imagen FROM proyecto p LEFT JOIN equipos e ON e.id_equi = p.id_equipo LEFT JOIN usuarios u ON u.id_usu = p.id_responsable;`
      db.query(sql, function (err, res) {
        if (err) {
          return reject({ status: 500, mensaje: err })
        }
        if (!res.length) {
          return resolve({ status: 200, mensaje: 'No hay proyectos activos' })
        }
        resolve({ status: 200, mensaje: 'Proyectos consultados con éxito', proyectos: res })
      })
    })
  }

  equipos(id_equipo) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM equipos WHERE id_equi = ?'
      const sqlMiembro = 'SELECT m.id_equi, m.id_usu, m.rol, m.fecha_ingreso, u.nombre, u.apellido, u.usuario, u.cedula FROM miembros m INNER JOIN usuarios u ON u.id_usu = m.id_usu WHERE m.id_equi = ?'
      db.beginTransaction(async (err) => {
        if (err) {
          return reject(err)
        }
        try {
          const miembros = await new Promise((resolve, reject) => {
            db.query(sqlMiembro, [id_equipo], function (err, res) {
              if (err) {
                return reject({ status: 500, mensaje: err })
              }
              resolve({ status: 200, mensaje: 'Exito de consulta', data: res })
            })
          })
          db.query(sql, [id_equipo], function (err, res) {
            if (err) {
              return reject({ status: 500, mensaje: err })
            }
            const equipos = res
            if (res.length) {
              equipos[0].miembros = miembros.data
              resolve({ status: 200, mensaje: 'Exito de consulta', data: equipos })
            } else {
              resolve({ mensaje: 'No hay equipos para mostrar', data: equipos, status: 200 })
            }
          })
        } catch (error) {
          reject({ status: 500, mensaje: error })
        }
      })
    })
  }

  uno(id_pro) {
    return new Promise((resolve, reject) => {
      console.log(id_pro)
      const sql = `SELECT p.id_pro, p.nombre AS nom_pro, p.descripcion AS des_pro, p.id_equipo, e.nombre AS nom_equi, e.descripcion AS des_equi, p.id_responsable, CONCAT(u.nombre, ' ', u.apellido) AS nom_lider, u.usuario, p.estado, p.fecha_creacion, p.fecha_inicio, p.fecha_cierre, p.documento, p.imagen FROM proyecto p LEFT JOIN equipos e ON e.id_equi = p.id_equipo LEFT JOIN usuarios u ON u.id_usu = p.id_responsable WHERE p.id_pro = ?`
      const sqlDec = 'SELECT d.id_deci, d.id_pro, d.titulo, d.descripcion, d.id_responsable, d.estado, d.valoracion, d.resultado, d.impacto, d.observacion, d.fecha, d.id_creador, u.nombre, u.apellido, u.usuario FROM decisiones d INNER JOIN usuarios u ON u.id_usu = d.id_creador WHERE id_pro = ?'
      const sqlComDec = 'SELECT v.id_val, v.puntaje, v.id_deci, v.fecha, v.id_creador, u.nombre, u.apellido, u.usuario, c.comentario, c.id_com_dec FROM valoracion_dec v INNER JOIN usuarios u ON v.id_creador = u.id_usu INNER JOIN comentarios_dec c ON v.id_val = c.id_val INNER JOIN decisiones de ON de.id_deci = v.id_deci INNER JOIN proyecto p ON p.id_pro = de.id_pro WHERE de.id_pro = ?'
      const sqlIdea = 'SELECT i.id_idea, i.id_pro, i.titulo, i.descripcion, i.id_creador, i.estado, i.fecha, u.nombre, u.apellido, u.usuario FROM ideas i INNER JOIN usuarios u ON u.id_usu = i.id_creador WHERE id_pro = ?'
      const sqlComIdea = 'SELECT v.id_val, v.puntaje, v.id_idea, v.fecha, v.id_creador, u.nombre, u.apellido, u.usuario, c.comentario, c.id_com_idea FROM valoracion_idea v INNER JOIN usuarios u ON v.id_creador = u.id_usu INNER JOIN comentarios_idea c ON V.id_val = c.id_val INNER JOIN ideas i ON i.id_idea = v.id_idea INNER JOIN proyecto p ON p.id_pro = i.id_pro WHERE i.id_pro = ?'

      db.beginTransaction(async (err) => {
        if (err) {
          return reject(err)
        }
        try {
          const comentariosDec = await new Promise((resolve, reject) => {
            db.query(sqlComDec, [id_pro], async (err, res) => {
              if (err) {
                return reject({ status: 500, mensaje: err })
              }
              if (!res.length) {
                return resolve({ status: 200, mensaje: 'No hay comentarios activas', data: res })
              }
              resolve({ status: 200, mensaje: 'Comentarios consultadas con éxito', data: res })
            })
          })

          const decisiones = await new Promise((resolve, reject) => {
            db.query(sqlDec, [id_pro], async (err, res) => {
              if (err) {
                return reject({ status: 500, mensaje: err })
              }
              if (!res.length) {
                return resolve({ status: 200, mensaje: 'No hay decisiones activas', data: res })
              }
              res.forEach(d => {
                d.comentarios = comentariosDec.data.filter(c => c.id_deci == d.id_deci)
              });
              resolve({ status: 200, mensaje: 'Desiciones consultadas con éxito', data: res })
            })
          })

          const comentariosIdea = await new Promise((resolve, reject) => {
            db.query(sqlComIdea, [id_pro], async (err, res) => {
              if (err) {
                return reject({ status: 500, mensaje: err })
              }
              if (!res.length) {
                return resolve({ status: 200, mensaje: 'No hay comentarios activas', data: res })
              }
              resolve({ status: 200, mensaje: 'Comentarios consultadas con éxito', data: res })
            })
          })

          const ideas = await new Promise((resolve, reject) => {
            db.query(sqlIdea, [id_pro], async (err, res) => {
              if (err) {
                return reject({ status: 500, mensaje: err })
              }
              if (!res.length) {
                return resolve({ status: 200, mensaje: 'No hay ideas activas', data: res })
              }
              res.forEach(d => {
                d.comentarios = comentariosIdea.data.filter(c => c.id_idea == d.id_idea)
              });
              resolve({ status: 200, mensaje: 'Ideas consultadas con éxito', data: res })
            })
          })

          db.query(sql, [id_pro], async (err, res) => {
            if (err) {
              return reject({ status: 500, mensaje: err })
            }
            if (!res.length) {
              return resolve({ status: 200, mensaje: 'No hay proyectos activos' })
            }
            const equipo = await this.equipos(res[0].id_equipo)
            res[0].equipo = equipo.data
            resolve({ status: 200, mensaje: 'Proyecto consultado con éxito', proyecto: res, des: decisiones.data, ideas: ideas.data })
          })
        } catch (error) {
          reject({ status: 500, mensaje: error })
        }
      })
    })
  }


  filtros(filtro) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT id_pro, nombre, descripcion, id_equipo, estado, fecha_creacion, fecha_inicio, fecha_cierre, id_responsable, documento, imagen FROM proyecto WHERE estado = ?'
      db.query(sql, [filtro], function (err, res) {
        if (err) {
          return reject({ status: 500, mensaje: err })
        }
        if (!res.length) {
          return resolve({ status: 200, mensaje: 'No hay proyectos ' + filtro })
        }
        resolve({ status: 200, mensaje: 'Proyectos consultados creado con éxito', proyectos: res })
      })
    })
  }

  crear(datos, files) {
    return new Promise((resolve, reject) => {
      const { nombre, descripcion, id_equipo, id_responsable } = datos
      const { imagen, documento } = files
      const sql = 'INSERT INTO proyecto (id_pro, nombre, descripcion, id_equipo, id_responsable, documento, imagen) VALUES (?,?,?,?,?,?,?)'
      if (!nombre || !descripcion) {
        return reject({ status: 404, mensaje: 'Datos incompletos' })
      }
      let imagenUrl
      let documentoUrl
      if (imagen) {
        imagenUrl = imagen[0].filename
      } else {
        imagenUrl = null
      }
      if (documento) {
        documentoUrl = documento[0].filename
      } else {
        documentoUrl = null
      }
      const insert = [uuidv4(), nombre, descripcion, id_equipo, id_responsable, documentoUrl, imagenUrl]
      db.query(sql, insert, function (err, res) {
        if (err) {
          return reject({ status: 500, mensaje: err })
        }
        resolve({ status: 200, mensaje: 'Proyecto creado con éxito' })
      })
    })
  }

  editar(datos, files) {
    return new Promise((resolve, reject) => {
      const { nombre, descripcion, id_equipo, id_responsable, id_pro } = datos
      const { imagen, documento } = files
      let editPro = [nombre, descripcion]
      let edit = []
      let imagenUrl
      let documentoUrl
      if (id_equipo) {
        edit.push('id_equipo = ?')
        editPro.push(id_equipo)
      }
      if (id_responsable) {
        edit.push('id_responsable = ?')
        editPro.push(id_responsable)
      }
      if (imagen) {
        imagenUrl = imagen[0].filename
        edit.push('imagen = ?')
        editPro.push(imagenUrl)
      }
      if (documento) {
        documentoUrl = documento[0].filename
        edit.push('documento = ?')
        editPro.push(documentoUrl)
      }
      editPro.push(id_pro)
      const campos = ', ' + edit.join(',')
      const sql = `UPDATE proyecto SET nombre = ?, descripcion = ? ${campos} WHERE id_pro = ?`

      db.query(sql, editPro, function (err, res) {
        if (err) {
          return reject({ status: 500, mensaje: err })
        }
        if (res.affectedRows === 0) {
          return resolve({ status: 404, mensaje: 'Proyecto no encontrado' })
        }

        resolve({ status: 200, mensaje: 'Proyecto editado con éxito' })
      })
    })
  }

  cambiarEstado(datos) {
    return new Promise((resolve, reject) => {
      const { estado, id_pro } = datos
      const sql = `UPDATE proyecto SET estado = ? WHERE id_pro = ?`
      db.query(sql, [estado, id_pro], function (err, res) {
        if (err) {
          return reject({ status: 500, mensaje: err })
        }
        if (res.affectedRows === 0) {
          return resolve({ status: 404, mensaje: 'Proyecto no encontrado' })
        }
        resolve({ status: 200, mensaje: 'Estado cambiado con éxito' })
      })
    })
  }

  cambiarLider(datos) {
    return new Promise((resolve, reject) => {
      const { id_responsable, id_pro } = datos
      const sql = `UPDATE proyecto SET id_responsable = ? WHERE id_pro = ?`
      db.query(sql, [id_responsable, id_pro], function (err, res) {
        if (err) {
          return reject({ status: 500, mensaje: err })
        }
        if (res.affectedRows === 0) {
          return resolve({ status: 404, mensaje: 'Proyecto no encontrado' })
        }
        resolve({ status: 200, mensaje: 'Líder cambiado con éxito' })
      })
    })
  }

  cambiarEquipo(datos) {
    return new Promise((resolve, reject) => {
      const { id_equipo, id_pro } = datos
      const sql = `UPDATE proyecto SET id_equipo = ? WHERE id_pro = ?`
      db.query(sql, [id_equipo, id_pro], function (err, res) {
        if (err) {
          return reject({ status: 500, mensaje: err })
        }
        if (res.affectedRows === 0) {
          return resolve({ status: 404, mensaje: 'Proyecto no encontrado' })
        }
        resolve({ status: 200, mensaje: 'Equipo cambiado con éxito' })
      })
    })
  }

  cambiarFechas(datos) {
    return new Promise((resolve, reject) => {
      const { inicio, cierre, id_pro } = datos
      const fecha_inicio = new Date(inicio) || null
      const fecha_cierre = new Date(cierre) || null
      let sqlArray = []
      let edit = []
      if (inicio) {
        sqlArray.push('fecha_inicio = ?')
        edit.push(fecha_inicio)
      }
      if (cierre) {
        sqlArray.push('fecha_cierre = ?')
        edit.push(fecha_cierre)
      }
      edit.push(id_pro)
      const campos = sqlArray.join(',')
      const sql = `UPDATE proyecto SET ${campos} WHERE id_pro = ?`
      db.query(sql, edit, function (err, res) {
        if (err) {
          return reject({ status: 500, mensaje: err })
        }
        if (res.affectedRows === 0) {
          return resolve({ status: 404, mensaje: 'Proyecto no encontrado' })
        }
        resolve({ status: 200, mensaje: 'Fechas ingresadas con éxito' })
      })
    })
  }

  eliminar(datos) {
    return new Promise((resolve, reject) => {
      const { id_pro, imagen, documento } = datos
      const sql = 'DELETE FROM proyecto WHERE id_pro = ?'
      db.query(sql, [id_pro], async function (err, res) {
        if (err) {
          return reject({ status: 500, mensaje: err })
        }
        if (res.affectedRows === 0) {
          return resolve({ status: 404, mensaje: 'Proyecto no encontrado' })
        }
        if (imagen) {
          try {
            const nombreImagen = path.basename(imagen);
            const rutaImagen = path.join(__dirname, '..', 'uploads', 'images', nombreImagen);
            await fs.unlink(rutaImagen);
          } catch (error) {
            console.warn("La imagen no existía en la carpeta, pero el registro se borró.");
          }
        }
        if (documento) {
          try {
            const nombreDoc = path.basename(documento);
            const rutaDoc = path.join(__dirname, '..', 'uploads', 'documents', nombreDoc);
            await fs.unlink(rutaDoc);
          } catch (error) {
            console.warn("El documento no existía en la carpeta.");
          }
        }
        resolve({ status: 200, mensaje: 'Proyecto eliminado con éxito' })
      })
    })
  }


}

module.exports = new proyectoM();