const { v4: uuidv4 } = require('uuid');
const db = require('../database/connection');

class comentariosM {

  async crearComentario(datos) {
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
    const conect = await db.getConnection();
    try {
      await conect.beginTransaction();
      const [miembros] = await conect.query(sqlMiembro, [id_pro])
      const [dataRes] = await conect.query(sqlResponsable, [id_pro])
      if (dataRes.length === 0) {
        return { status: 404, mensaje: 'Decisión no encontrado' }
      }
      const responsable = dataRes[0]
      const pertenece = miembros.some(m => m.id_usu === String(id_usu))
      if ((!pertenece) && (responsable != id_usu)) {
        return { status: 401, mensaje: 'No perteneces al equipo' }
      }
      const [resCount] = await conect.query(sqlPuntaje, [id_deci])
      if (resCount.length === 0) {
        return { status: 404, mensaje: 'Decisión no encontrado' }
      }
      const count = resCount[0].valoracion
      let valoracionFinal = parseFloat(count) + parseFloat(puntaje)
      const [valMod] = await conect.query(sqlPuntajeInsert, [valoracionFinal, id_deci])
      if (valMod.affectedRows === 0) {
        return { status: 401, mensaje: 'Valoración no encontrada' }
      }
      await conect.query(sql, insert)
      await conect.query(sqlComentario, comentarioInsert)
      await conect.commit();
      return { status: 200, mensaje: 'Comentario creado con éxito' }
    } catch (error) {
      await conect.rollback()
      throw { status: 500, mensaje: error.message || error };
    }
  }

  async crearComentarioIdea(datos) {
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
    const conect = await db.getConnection();
    try {
      const [miembros] = await conect.query(sqlMiembro, [id_pro])
      const [resRespo] = await conect.query(sqlResponsable, [id_pro])
      if (resRespo.length === 0) {
        return { status: 404, mensaje: 'Decisión no encontrado' }
      }
      const responsable = resRespo[0].id_responsable
      const pertenece = miembros.some(m => m.id_usu === String(id_usu))
      if ((!pertenece) && (responsable != id_usu)) {
        return { status: 401, mensaje: 'No perteneces al equipo' }
      }
      const [resCount] = await conect.query(sqlPuntaje, [id_idea])
      if (resCount.length === 0) {
        return { status: 404, mensaje: 'Decisión no encontrado' }
      }
      const count = resCount[0].valoracion
      let valoracionFinal = parseFloat(count) + parseFloat(puntaje)
      await conect.query(sqlPuntajeInsert, [valoracionFinal, id_idea])
      await conect.query(sql, insert)
      await conect.query(sqlComentario, comentarioInsert)
      await conect.commit();
      return { status: 200, mensaje: 'Comentario creado con éxito' }
    } catch (error) {
      await conect.rollback()
      throw { status: 500, mensaje: error.message || error };
    }
  }


  async eliminarComDec(datos) {
    const { id_com_dec, id_usu, id_pro } = datos
    const sqlVal = 'SELECT c.id_val, d.valoracion, v.puntaje, v.id_creador, d.id_deci FROM comentarios_dec c INNER JOIN valoracion_dec v ON c.id_val = v.id_val INNER JOIN decisiones d ON d.id_deci = v.id_deci WHERE c.id_com_dec = ?'
    const sqlEdit = 'UPDATE decisiones SET valoracion = ? WHERE id_deci = ?'
    const sql = 'DELETE FROM comentarios_dec WHERE id_com_dec = ?'
    const sqlResponsable = 'SELECT id_responsable FROM proyecto WHERE id_pro = ?'
    const conect = await db.getConnection();
    try {
      await conect.beginTransaction()
      const [resRespo] = await conect.query(sqlResponsable, [id_pro])
      if (resRespo.length === 0) {
        return { status: 404, mensaje: 'Decisión no encontrado' }
      }
      const responsable = resRespo[0].id_responsable
      const [comRes] = await conect.query(sqlVal, [id_com_dec])
      if (comRes.length === 0) {
        return { status: 404, mensaje: 'Decisión no encontrado' }
      }
      const comentariosDatos = comRes[0]

      if (responsable != id_usu && comentariosDatos.id_creador != id_usu) {
        return { status: 401, mensaje: 'No tienes permisos para realizar esta acción' }
      }
      let valoracionFinal = parseFloat(comentariosDatos.valoracion) - parseFloat(comentariosDatos.puntaje)
      const [valoracionEditada] = await conect.query(sqlEdit, [valoracionFinal, comentariosDatos.id_deci])
      if (valoracionEditada.affectedRows === 0) {
        return { status: 404, mensaje: 'Decisión no encontrado' }
      }
      const [comEl] = await conect.query(sql, [id_com_dec])
      if (comEl.affectedRows === 0) {
        return { status: 404, mensaje: 'Comentario no encontrado' }
      }
      await conect.query(sql, [id_com_dec])
      await conect.commit()
      return { status: 200, mensaje: 'Comentario eliminado con éxito' }
    } catch (error) {
      throw { status: 500, mensaje: error.message || error };
    }
  }

  async eliminarComIdea(datos) {
    const { id_com_idea, id_usu, id_pro } = datos
    const sqlVal = 'SELECT c.id_val, i.valoracion, v.puntaje, v.id_creador, i.id_idea FROM comentarios_idea c INNER JOIN valoracion_idea v ON c.id_val = v.id_val INNER JOIN ideas i ON i.id_idea = v.id_idea WHERE c.id_com_idea = ?'
    const sqlEdit = 'UPDATE ideas SET valoracion = ? WHERE id_idea = ?'
    const sql = 'DELETE FROM comentarios_idea WHERE id_com_idea = ?'
    const sqlResponsable = 'SELECT id_responsable FROM proyecto WHERE id_pro = ?'
    const conect = await db.getConnection();
    try {
      await conect.beginTransaction()
      const [resRespo] = await conect.query(sqlResponsable, [id_pro])
      if (resRespo.length === 0) {
        return { status: 404, mensaje: 'Decisión no encontrado' }
      }
      const responsable = resRespo[0].id_responsable
      const [comRes] = await conect.query(sqlVal, [id_com_idea])
      if (comRes.length === 0) {
        return { status: 404, mensaje: 'Decisión no encontrado' }
      }
      const comentariosDatos = comRes[0]
      if (responsable != id_usu && comentariosDatos.id_creador != id_usu) {
        return { status: 401, mensaje: 'No tienes permisos para realizar esta acción' }
      }
      let valoracionFinal = parseFloat(comentariosDatos.valoracion) - parseFloat(comentariosDatos.puntaje)
      const [valoracionEditada] = await conect.query(sqlEdit, [valoracionFinal, comentariosDatos.id_idea])
      if (valoracionEditada.affectedRows === 0) {
        return { status: 404, mensaje: 'Decisión no encontrado' }
      }
      await conect.query(sql, [id_com_idea])
      await conect.commit()
      return { status: 200, mensaje: 'Comentario eliminado con éxito' }
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
    const conect = await db.getConnection();
    try {
      await conect.beginTransaction()
      const [resCreador] = await conect.query(sqlCreador, [id_deci])
      if (resCreador.length === 0) {
        return { status: 404, mensaje: 'Decisión no encontrado' }
      }
      const creador = resCreador[0].id_creador
      const [resRespo] = await conect.query(sqlResponsable, [id_pro])
      if (resRespo.length === 0) {
        return { status: 404, mensaje: 'Decisión no encontrado' }
      }
      const responsable = resRespo[0].id_responsable
      if (responsable != id_usu && creador != id_usu) {
        return { status: 401, mensaje: 'No tienes permisos para realizar esta acción' }
      }
      conect.query(sql, info)
      await conect.commit()
      return { status: 200, mensaje: 'Estado cambiado con éxito' }
    } catch (error) {
      throw { status: 500, mensaje: error.message || error };
    }
  }

}

module.exports = new comentariosM();