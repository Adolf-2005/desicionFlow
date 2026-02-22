const { v4: uuidv4 } = require('uuid');
const db = require('../database/connection')
require('dotenv').config()


class proyectoM {

  todos() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT id_pro, nombre, descripcion, id_equipo, estado, fecha_creacion, fecha_inicio, fecha_cierre, id_responsable, documento, imagen FROM proyecto'
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
      db.query(sql, insert, function (err, res) {
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
        resolve({ status: 200, mensaje: 'Proyecto editado con éxito' })
      })
    })
  }

  actualizarImagen(datos) {
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
        resolve({ status: 200, mensaje: 'Proyecto editado con éxito' })
      })
    })
  }

  actualizarDocumento() {
    return new Promise((resolve, reject) => {

    })
  }

}

module.exports = new proyectoM();