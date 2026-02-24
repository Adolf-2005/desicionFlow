const { v4: uuidv4 } = require('uuid');
const db = require('../database/connection')
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
        imagenUrl = process.env.PATH_IMAGEN + imagen[0].filename
      } else {
        imagenUrl = null
      }
      if (documento) {
        documentoUrl = process.env.PATH_DOCUMENT + documento[0].filename
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
      const { foto, documento } = files
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
      if (foto) {
        imagenUrl = process.env.PATH_IMAGEN + foto[0].filename
        edit.push('imagen = ?')
        editPro.push(imagenUrl)
      }
      if (documento) {
        documentoUrl = process.env.PATH_DOCUMENT + documento[0].filename
        edit.push('documento = ?')
        editPro.push(documentoUrl)
      }
      editPro.push(id_pro)
      const campos = ', ' + edit.join(',')
      const sql = `UPDATE proyecto SET nombre = ?, descripcion = ? ${campos} WHERE id_pro = ?`
      console.log('paso 2')

      db.query(sql, editPro, function (err, res) {
        if (err) {
          console.log('error: ', err)

          return reject({ status: 500, mensaje: err })
        }
        if (res.affectedRows === 0) {
          console.log(res)
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

  eliminar(id) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM proyecto WHERE id_pro = ?'
      db.query(sql, [id], function (err, res) {
        if (err) {
          return reject({ status: 500, mensaje: err })
        }
        if (res.affectedRows === 0) {
          return resolve({ status: 404, mensaje: 'Proyecto no encontrado' })
        }
        resolve({ status: 200, mensaje: 'Proyecto eliminado con éxito' })
      })
    })
  }


}

module.exports = new proyectoM();