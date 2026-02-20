const { v4: uuidv4 } = require('uuid');
const db = require('../database/connection')
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
require('dotenv').config()


class usuariosM {

  todos() {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT u.id_usu, u.nombre, u.apellido, u.usuario, u.cedula, u.id_rol, r.nombre AS rol FROM usuarios u LEFT JOIN roles r ON r.id_rol = u.id_rol WHERE u.activo = 1'
      db.query(sql, function (err, res) {
        if (err) {
          return reject({ status: 500, mensaje: err })
        }
        if (!res.length) {
          return resolve({ status: 200, mensaje: 'No hay usuarios registrados' })
        }
        resolve({ status: 200, mensaje: 'Usuarios consultados con éxito', usuarios: res })
      })
    })
  }

  crear(user) {
    return new Promise(async (resolve, reject) => {
      const { nombre, apellido, usuario, clave, cedula, id_rol } = user
      const sql = 'INSERT INTO usuarios (id_usu, nombre, apellido, usuario, clave, cedula, id_rol) VALUES (?,?,?,?,?,?,?)'
      const hash = await bcrypt.hash(clave, saltRounds);
      const insert = [uuidv4(), nombre, apellido, usuario.toLowerCase(), hash, cedula, id_rol]
      try {
        db.query(sql, insert, function (err, res) {
          if (err) {
            if (err.errno == 1062) {
              if (err.sqlMessage.includes('cedula')) {
                return reject({ status: 409, mensaje: 'Ya existe un usuario con la cedula ' + cedula })
              }
              if (err.sqlMessage.includes('usuario')) {
                return reject({ status: 409, mensaje: 'Ya esta registrado el nombre de usuario' })
              }
            }
            return reject({ status: 500, mensaje: err })
          }
          resolve({ status: 201, mensaje: 'Usuario creado' })
        })
      } catch (error) {
        reject(error)
      }
    })
  }

  login(user) {
    return new Promise(async (resolve, reject) => {
      const { usuario, clave } = user
      const sql = 'SELECT u.id_usu, u.nombre, u.apellido, u.usuario, u.clave, u.change_pass, u.cedula, u.id_rol, r.nombre AS rol FROM usuarios u LEFT JOIN roles r ON r.id_rol = u.id_rol WHERE u.usuario = ?'
      db.query(sql, [usuario], async function (err, res) {
        if (err) {
          return reject({ status: 500, mensaje: err })
        }
        if (!res.length) {
          return resolve({ status: 404, mensaje: 'Usuario no encontrado' })
        }
        const hash = res[0].clave
        const access = await bcrypt.compare(clave, hash)
        if (access === true) {
          const token = jwt.sign({
            usuario: res[0].usuario,
            id: res[0].id_usu,
          }, process.env.JSONWEBTOKEN, { expiresIn: '12' });
          const cambio = res[0].change_pass == 1 ? true : false
          resolve({ status: 200, mensaje: 'Bienvenido ' + res[0].usuario, token: token, expiresIn: 12, cambio_clave: cambio })
        } else {
          resolve({ status: 401, mensaje: 'Contraseña incorrecta' })
        }
      })
    })
  }

  cambioClave(datos) {
    return new Promise((resolve, reject) => {
      const { actual, clave, usuario } = datos
      const sql = 'SELECT clave, change_pass FROM usuarios WHERE usuario = ?'
      const sqlChange = 'UPDATE usuarios SET clave = ?, change_pass = ? WHERE usuario = ?'
      db.query(sql, [usuario], async function (err, res) {
        if (err) {
          return reject({ status: 500, mensaje: err })
        }
        if (!res.length) {
          return resolve({ status: 404, mensaje: 'Usuario no encontrado' })
        }
        if (res[0].change_pass == 0) {
          return reject({ status: 401, mensaje: 'Cambio no aprobado' })
        }
        const hash = res[0].clave
        const access = await bcrypt.compare(actual, hash)
        if (access === true) {
          const hashPass = await bcrypt.hash(clave, saltRounds);
          db.query(sqlChange, [hashPass, usuario, 0], async function (err, res) {
            if (err) {
              return reject({ status: 500, mensaje: err })
            }
            if (res.affectedRows === 0) {
              return reject({ status: 400, mensaje: 'Usuario no encontrado' })
            }
          })
          resolve({ status: 200, mensaje: 'Bienvenido'})
        } else {
          resolve({ status: 401, mensaje: 'Contraseña incorrecta' })
        }
      })
    })
  }

  editar(user) {
    return new Promise((resolve, reject) => {
      const { nombre, apellido, cedula, id_rol, id_usu } = user
      const sql = 'UPDATE usuarios SET nombre=?, apellido=?, cedula=?, id_rol =? WHERE id_usu =?'
      const edit = [nombre, apellido, cedula, id_rol, id_usu]
      if (!id_usu || !cedula || !nombre || !apellido) {
        return reject({ status: 400, mensaje: 'Datos incompletos' })
      }
      db.query(sql, edit, function (err, res) {
        if (err) {
          return reject({ status: 500, mensaje: err })
        }
        if (res.affectedRows === 0) {
          return reject({ status: 400, mensaje: 'Usuario no encontrado' })
        }
        resolve({ status: 200, mensaje: 'Usuario editado con éxito' })
      })
    })
  }

  eliminar(id_usu) {
    return new Promise((resolve, reject) => {
      const sql = 'UPDATE usuarios SET activo = ? WHERE id_usu = ?'
      console.log(id_usu)
      if (!id_usu) {
        return reject({ status: 404, mensaje: 'Datos incompletos' })
      }
      db.query(sql, [0, id_usu], function (err, res) {
        if (err) {
          return reject({ status: 500, mensaje: err })
        }
        if (res.affectedRows === 0) {
          return reject({ status: 404, mensaje: 'Usuario no encontrado' })
        }
        resolve({ status: 200, mensaje: 'Usuario eliminado con éxito' })
      })
    })
  }
}

module.exports = new usuariosM();