const { v4: uuidv4 } = require('uuid');
const db = require('../database/connection');

class ideasM {

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
    const { id_pro, titulo, descripcion, id_creador, id_usu } = datos
    const sql = 'INSERT INTO ideas (id_idea, id_pro, titulo, descripcion, id_creador) VALUES (?,?,?,?,?)'
    const insert = [uuidv4(), id_pro, titulo, descripcion, id_creador]
    try {
      await this.verificar(id_pro, id_usu)
      await db.query(sql, insert)
      return { status: 200, mensaje: 'Decisión creada con éxito' }
    } catch (error) {
      throw { status: 500, mensaje: error.message || error };
    }
  }

  async editar(datos) {
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
      const [ResData] = await db.query(sqlResponsable, [id_pro])
      const responsable = ResData[0].id_responsable
      if (responsable != id_usu && id_creador != id_usu) {
        return reject({ status: 401, mensaje: 'No perteneces al equipo' })
      }
      await db.query(sql, dataEdit)
      return { status: 200, mensaje: 'Editado con exito' }
    } catch (error) {
      throw { status: 500, mensaje: error.message || error };
    }
  }

  async eliminar(datos) {
    const { id_creador, id_usu, id_idea, id_pro } = datos
    const sqlResponsable = 'SELECT id_responsable FROM proyecto WHERE id_pro = ?'
    const sql = 'DELETE FROM ideas WHERE id_idea = ?'
    try {
      const [ResData] = await db.query(sqlResponsable, [id_pro])
      const responsable = ResData[0].id_responsable
      if (responsable != id_usu && id_creador != id_usu) {
        return reject({ status: 401, mensaje: 'No perteneces al equipo' })
      }
      const [eli] = await db.query(sql, [id_idea])
      if (eli.affectedRows === 0) {
        return { status: 404, mensaje: 'Idea no encontrada' }
      }
      return { status: 200, mensaje: 'Elimando con exito' }
    } catch (error) {
      throw { status: 500, mensaje: error.message || error };
    }
  }

  async convertirDecision(datos) {
    const { id_usu, id_idea, id_pro } = datos
    const sqlResponsable = 'SELECT id_responsable FROM proyecto WHERE id_pro = ?'
    const sqlGetIdea = 'SELECT * FROM ideas WHERE id_idea = ?';
    const sqlInsertDecision = `INSERT INTO decisiones (id_deci, id_pro, titulo, descripcion, id_creador, estado, valoracion, fecha) VALUES (?, ?, ?, ?, ?, 'abierta', 0, CURRENT_TIMESTAMP)`;
    const sqlUpdateIdea = "UPDATE ideas SET estado = 'Aceptada' WHERE id_idea = ?";
    const conect = await db.getConnection()
    try {
      conect.beginTransaction()
      const [ResData] = await db.query(sqlResponsable, [id_pro])
      const responsable = ResData[0].id_responsable
      if (responsable != id_usu) {
        return { status: 401, mensaje: 'No perteneces al equipo' }
      }
      const [resIdea] = await conect.query(sqlGetIdea, [id_idea])
      if (resIdea.length === 0) return { status: 404, mensaje: 'Idea no encontrada' }
      const idea = resIdea[0]
      const id_deci = uuidv4();
      await conect.query(sqlInsertDecision, [id_deci, idea.id_pro, idea.titulo, idea.descripcion, idea.id_creador])
      await conect.query(sqlUpdateIdea, [id_idea])
      await conect.commit()
      return { status: 200, mensaje: 'Idea convertida a decisión con éxito', id_decision: id_deci };

    } catch (error) {
      await conect.rollback()
      throw { status: 500, mensaje: error.message || error };
    }
  }

}

module.exports = new ideasM();