const { v4: uuidv4 } = require('uuid');
const db = require('../database/connection')
const bcrypt = require('bcrypt');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
require('dotenv').config()


class usuariosM {

  async todos() {
    const sql = 'SELECT id_usu, nombre, apellido, usuario, cedula, rol FROM usuarios WHERE activo = 1'
    try {
      const [res] = await db.query(sql)
      if (res.length === 0) {
        return { status: 200, mensaje: 'No hay usuarios registrados' }
      }
      return { status: 200, mensaje: 'Usuarios consultados con éxito', usuarios: res }
    } catch (error) {
      throw { status: 500, mensaje: error };
    }
  }

  async crear(user) {
    const { nombre, apellido, usuario, clave, cedula, rol } = user
    const sql = 'INSERT INTO usuarios (id_usu, nombre, apellido, usuario, clave, cedula, rol) VALUES (?,?,?,?,?,?,?)'
    const hash = await bcrypt.hash(clave, saltRounds);
    const insert = [uuidv4(), nombre, apellido, usuario.toLowerCase(), hash, cedula, rol]
    try {
      await db.query(sql, insert)
      return { status: 201, mensaje: 'Usuario creado' }
    } catch (error) {
      if (error.sqlMessage.includes('cedula')) {
        throw { status: 409, mensaje: 'Ya existe un usuario con la cedula ' + cedula }
      }
      if (error.sqlMessage.includes('usuario')) {
        throw { status: 409, mensaje: 'Ya esta registrado el nombre de usuario' }
      }
      throw { status: 500, mensaje: error };
    }
  }

  async login(user) {
    const { usuario, clave } = user
    const sql = 'SELECT id_usu, nombre, apellido, usuario, clave, change_pass, cedula, rol FROM usuarios WHERE usuario = ?'
    try {
      const [res] = await db.query(sql, [usuario])
      if (!res.length) {
        return { status: 404, mensaje: 'Usuario no encontrado' }
      }
      const hash = res[0].clave
      const access = await bcrypt.compare(clave, hash)
      if (access === true) {
        const token = jwt.sign({
          usuario: res[0].usuario,
          id: res[0].id_usu,
          rol:res[0].rol
        }, process.env.JSONWEBTOKEN, { expiresIn: '12h' });
        const cambio = res[0].change_pass == 1 ? true : false
        return { status: 200, mensaje: 'Bienvenido ' + res[0].usuario, token: token, expiresIn: 12, cambio_clave: cambio }
      } else {
        return { status: 401, mensaje: 'Contraseña incorrecta' }
      }
    } catch (error) {
      throw { status: 500, mensaje: error };
    }
  }

  async cambioClave(datos) {
    const { actual, clave, usuario } = datos
    const sql = 'SELECT clave, change_pass FROM usuarios WHERE usuario = ?'
    const sqlChange = 'UPDATE usuarios SET clave = ?, change_pass = ? WHERE usuario = ?'
    try {
      const [res] = await db.query(sql, [usuario])
      if (!res.length) {
        return { status: 404, mensaje: 'Usuario no encontrado' }
      }
      if (res[0].change_pass == 0) {
        return { status: 401, mensaje: 'Cambio no aprobado' }
      }
      const hash = res[0].clave
      const access = await bcrypt.compare(actual, hash)
      if (access === true) {
        const hashPass = await bcrypt.hash(clave, saltRounds);
        const [resPass] = await db.query(sqlChange, [hashPass, usuario, 0])
        if (resPass.affectedRows === 0) {
          return { status: 400, mensaje: 'Usuario no encontrado' }
        }
        return { status: 200, mensaje: 'Bienvenido' }
      } else {
        return { status: 401, mensaje: 'Contraseña incorrecta' }
      }
    } catch (error) {
      throw { status: 500, mensaje: error };
    }

  }

  async editar(user) {
    const { nombre, apellido, cedula, rol, id_user } = user
    const sql = 'UPDATE usuarios SET nombre=?, apellido=?, cedula=?, rol=? WHERE id_usu =?'
    const edit = [nombre, apellido, cedula, rol, id_user]
    if (!id_user || !cedula || !nombre || !apellido) {
      return { status: 400, mensaje: 'Datos incompletos' }
    }
    try {
      const [res] = await db.query(sql, edit)
      if (res.affectedRows === 0) {
        return { status: 400, mensaje: 'Usuario no encontrado' }
      }
      return { status: 200, mensaje: 'Usuario editado con éxito' }
    } catch (error) {
      throw { status: 500, mensaje: error };
    }
  }

  async eliminar(id_user) {
    const sql = 'UPDATE usuarios SET activo = ? WHERE id_usu = ?'
    if (!id_user) {
      return { status: 404, mensaje: 'Datos incompletos' }
    }
    try {
      const [res] = await db.query(sql, [0, id_user])
      if (res.affectedRows === 0) {
        return { status: 404, mensaje: 'Usuario no encontrado' }
      }
      return { status: 200, mensaje: 'Usuario eliminado con éxito' }
    } catch (error) {
      throw { status: 500, mensaje: error };
    }
  }
}

module.exports = new usuariosM();