const { v4: uuidv4 } = require('uuid');
const db = require('../database/connection');

class decisionesM {

  async verificar(id_pro, id_usu) {
    const sqlMiembro = 'SELECT m.id_usu FROM proyecto p INNER JOIN miembros m ON p.id_equipo = m.id_equi WHERE p.id_pro = ?'
    const sqlResponsable = 'SELECT id_responsable FROM proyecto WHERE id_pro = ?'
    try {
      const [miembros] = await db.query(sqlMiembro, [id_pro])
      const [ResData] = await db.query(sqlResponsable, [id_pro])
      const responsable = ResData[0].id_responsable

      const pertenece = miembros.some(m => m.id_usu === id_usu)
      if (!pertenece && responsable != id_usu) {
        throw { status: 401, mensaje: 'No perteneces al equipo' }
      }
      return true
    } catch (error) {
      throw { status: 500, mensaje: error.message || error };
    }
  }

  async crear(datos) {
    const { id_pro, titulo, descripcion, id_creador, id_usu, estado, impacto, observacion, resultado } = datos
    const sql = 'INSERT INTO decisiones (id_deci, id_pro, titulo, descripcion, id_creador, estado, impacto, observacion, resultado) VALUES (?,?,?,?,?,?,?,?,?)'
    const insert = [uuidv4(), id_pro, titulo, descripcion, id_creador, estado, impacto, observacion, resultado]
    try {
      await this.verificar(id_pro, id_usu)
      await db.query(sql, insert)
      return { status: 200, mensaje: 'Decisión creada con éxito' }
    } catch (error) {
      throw { status: 500, mensaje: error.message || error };
    }
  }

  async editar(datos) {
    const { id_deci, titulo, descripcion, estado, impacto, observacion, id_usu, id_pro } = datos
    const sql = 'UPDATE decisiones SET titulo=?, descripcion=?, estado=?, impacto=?, observacion=? WHERE id_deci = ?'
    const sqlCreador = 'SELECT id_creador FROM decisiones WHERE id_deci = ?'
    const sqlResponsable = 'SELECT id_responsable FROM proyecto WHERE id_pro = ?'
    const edit = [titulo, descripcion, estado, impacto, observacion, id_deci]
    try {
      const [resCreador] = await db.query(sqlCreador, [id_deci])
      if (resCreador.length === 0) {
        return { status: 404, mensaje: 'Decisión no encontrado' }
      }
      const creador = resCreador[0].id_creador
      const [ResData] = await db.query(sqlResponsable, [id_pro])
      if (ResData.length === 0) {
        return { status: 404, mensaje: 'Responsable no encontrado' }
      }
      const responsable = ResData[0].id_responsable

      if (responsable != id_usu && creador != id_usu) {
        return { status: 401, mensaje: 'No tienes permisos para realizar esta acción' }
      }
      await db.query(sql, edit)
      return { status: 200, mensaje: 'Decisión editada con éxito' }
    } catch (error) {
      throw { status: 500, mensaje: error.message || error };
    }
  }

  async eliminar(datos) {
    const { id_deci, id_pro, id_usu } = datos
    const sql = 'DELETE FROM decisiones WHERE id_deci = ?'
    const sqlCreador = 'SELECT id_creador FROM decisiones WHERE id_deci = ?'
    const sqlResponsable = 'SELECT id_responsable FROM proyecto WHERE id_pro = ?'
    try {
      const [resCreador] = await db.query(sqlCreador, [id_deci])
      if (resCreador.length === 0) {
        return { status: 404, mensaje: 'Decisión no encontrado' }
      }
      const creador = resCreador[0].id_creador

      const [ResData] = await db.query(sqlResponsable, [id_pro])
      if (ResData.length === 0) {
        return { status: 404, mensaje: 'Responsable no encontrado' }
      }
      const responsable = ResData[0].id_responsable
      if (responsable != id_usu && creador != id_usu) {
        return { status: 401, mensaje: 'No tienes permisos para realizar esta acción' }
      }
      const [elim] = await db.query(sql, [id_deci])
      if (elim.affectedRows === 0) {
        return { status: 404, mensaje: 'Decisión no encontrado' }
      }
      return { status: 200, mensaje: 'Decisión eliminada con éxito' }
    } catch (error) {
      throw { status: 500, mensaje: error.message || error };
    }

  }

  async cambiarEstado(datos) {
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
      const [resCreador] = await db.query(sqlCreador, [id_deci])
      if (resCreador.length === 0) {
        return { status: 404, mensaje: 'Decisión no encontrado' }
      }
      const creador = resCreador[0].id_creador

      const [ResData] = await db.query(sqlResponsable, [id_pro])
      if (ResData.length === 0) {
        return { status: 404, mensaje: 'Responsable no encontrado' }
      }
      const responsable = ResData[0].id_responsable

      if (responsable != id_usu && creador != id_usu) {
        return { status: 401, mensaje: 'No tienes permisos para realizar esta acción' }
      }
      const [edit] = await db.query(sql, info)
      if (edit.affectedRows === 0) {
        return { status: 404, mensaje: 'Decisión no encontrado' }
      }
      return { status: 200, mensaje: 'Estado cambiado con éxito' }
    } catch (error) {
      throw { status: 500, mensaje: error.message || error };
    }
  }

}

module.exports = new decisionesM();