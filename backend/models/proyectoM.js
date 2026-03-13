const { v4: uuidv4 } = require('uuid');
const db = require('../database/connection'); // Asegúrate que exporte require('mysql2/promise')
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

class proyectoM {
  async todos() {
    const sql = `SELECT p.id_pro, p.nombre AS nom_pro, p.descripcion AS des_pro, 
               p.id_equipo, e.nombre AS nom_equi, e.descripcion AS des_equi, 
               p.id_responsable, CONCAT(u.nombre, ' ', u.apellido) AS nom_lider, 
               u.usuario, p.estado, p.fecha_creacion, p.fecha_inicio, p.fecha_cierre, 
               p.documento, p.imagen 
               FROM proyecto p 
               LEFT JOIN equipos e ON e.id_equi = p.id_equipo 
               LEFT JOIN usuarios u ON u.id_usu = p.id_responsable;`;

    try {
      const [res] = await db.query(sql);
      if (res.length === 0) {
        return { status: 200, mensaje: 'No hay proyectos activos' };
      }
      return { status: 200, mensaje: 'Proyectos consultados con éxito', proyectos: res };
    } catch (error) {
      throw { status: 500, mensaje: error.message || error };
    }
  }

  async proyectosAsignados(datos) {
    const { id_usu } = datos
    const sqlEqui = 'SELECT * FROM miembros WHERE id_usu = ?'
    const sqlProyecto = `SELECT p.id_pro, p.nombre AS nom_pro, p.descripcion AS des_pro, 
               p.id_equipo, e.nombre AS nom_equi, e.descripcion AS des_equi, 
               p.id_responsable, CONCAT(u.nombre, ' ', u.apellido) AS nom_lider, 
               u.usuario, p.estado, p.fecha_creacion, p.fecha_inicio, p.fecha_cierre, 
               p.documento, p.imagen 
               FROM proyecto p 
               LEFT JOIN equipos e ON e.id_equi = p.id_equipo 
               LEFT JOIN usuarios u ON u.id_usu = p.id_responsable WHERE p.id_equipo = ?
              `
    let proyectos = []
    const conect = await db.getConnection()
    try {
      await conect.beginTransaction()
      const [res] = await conect.query(sqlEqui, id_usu)
      if (res.length === 0) {
        return { status: 200, mensaje: 'No hay proyectos activos' }
      }
      for (const e of res) {
        const [p] = await conect.query(sqlProyecto, e.id_equi)
        p.forEach(e => {
          proyectos.push(e)
        });
      }
      await conect.commit()
      return { status: 200, mensaje: 'Proyectos consultados con éxito', proyectos: proyectos }
    } catch (error) {
      throw { status: 500, mensaje: error.message || error };
    }
  }

  async equipos(id_equipo) {
    const sql = 'SELECT * FROM equipos WHERE id_equi = ?'
    const sqlMiembro = 'SELECT m.id_equi, m.id_usu, m.rol, m.fecha_ingreso, u.nombre, u.apellido, u.usuario, u.cedula FROM miembros m INNER JOIN usuarios u ON u.id_usu = m.id_usu WHERE m.id_equi = ?'
    const conect = await db.getConnection()
    try {
      await conect.beginTransaction()
      const [miembros] = await conect.query(sqlMiembro, [id_equipo])
      const [listaEquipos] = await conect.query(sql, [id_equipo])
      await conect.commit()
      if (listaEquipos.length) {
        const equipo = listaEquipos[0].miembros = miembros
        return { status: 200, mensaje: 'Exito de consulta', data: equipo }
      } else {
        return { mensaje: 'No hay equipos para mostrar', data: equipos, status: 200 }
      }
    } catch (error) {
      throw { status: 500, mensaje: error }
    }
  }

  async uno(id_pro) {
    const sql = `SELECT p.id_pro, p.nombre AS nom_pro, p.descripcion AS des_pro, p.id_equipo, e.nombre AS nom_equi, e.descripcion AS des_equi, p.id_responsable, CONCAT(u.nombre, ' ', u.apellido) AS nom_lider, u.usuario, p.estado, p.fecha_creacion, p.fecha_inicio, p.fecha_cierre, p.documento, p.imagen FROM proyecto p LEFT JOIN equipos e ON e.id_equi = p.id_equipo LEFT JOIN usuarios u ON u.id_usu = p.id_responsable WHERE p.id_pro = ?`;
    const sqlDec = 'SELECT d.id_deci, d.id_pro, d.titulo, d.descripcion, d.estado, d.valoracion, d.resultado, d.impacto, d.observacion, d.fecha, d.id_creador, u.nombre, u.apellido, u.usuario FROM decisiones d INNER JOIN usuarios u ON u.id_usu = d.id_creador WHERE id_pro = ?';
    const sqlComDec = 'SELECT v.id_val, v.puntaje, v.id_deci, v.fecha, v.id_creador, u.nombre, u.apellido, u.usuario, c.comentario, c.id_com_dec FROM valoracion_dec v INNER JOIN usuarios u ON v.id_creador = u.id_usu INNER JOIN comentarios_dec c ON v.id_val = c.id_val INNER JOIN decisiones de ON de.id_deci = v.id_deci INNER JOIN proyecto p ON p.id_pro = de.id_pro WHERE de.id_pro = ?';
    const sqlIdea = 'SELECT i.id_idea, i.id_pro, i.titulo, i.descripcion, i.id_creador, i.estado, i.fecha, i.valoracion, u.nombre, u.apellido, u.usuario FROM ideas i INNER JOIN usuarios u ON u.id_usu = i.id_creador WHERE id_pro = ?';
    const sqlComIdea = 'SELECT v.id_val, v.puntaje, v.id_idea, v.fecha, v.id_creador, u.nombre, u.apellido, u.usuario, c.comentario, c.id_com_idea FROM valoracion_idea v INNER JOIN usuarios u ON v.id_creador = u.id_usu INNER JOIN comentarios_idea c ON v.id_val = c.id_val INNER JOIN ideas i ON i.id_idea = v.id_idea INNER JOIN proyecto p ON p.id_pro = i.id_pro WHERE i.id_pro = ?';

    const conn = await db.getConnection();
    try {
      await conn.beginTransaction();

      const [comentariosDec] = await conn.query(sqlComDec, [id_pro]);
      const [decisiones] = await conn.query(sqlDec, [id_pro]);
      decisiones.forEach(d => {
        d.comentarios = comentariosDec.filter(c => c.id_deci == d.id_deci);
      });

      const [comentariosIdea] = await conn.query(sqlComIdea, [id_pro]);
      const [ideas] = await conn.query(sqlIdea, [id_pro]);
      ideas.forEach(i => {
        i.comentarios = comentariosIdea.filter(c => c.id_idea == i.id_idea);
      });

      const [res] = await conn.query(sql, [id_pro]);
      if (!res.length) {
        await conn.commit();
        return { status: 200, mensaje: 'No hay proyectos activos' };
      }

      const equipoData = await this.equipos(res[0].id_equipo);
      res[0].equipo = equipoData.data;

      await conn.commit();
      return { status: 200, mensaje: 'Proyecto consultado con éxito', proyecto: res, des: decisiones, ideas: ideas };

    } catch (error) {
      await conn.rollback();
      throw { status: 500, mensaje: error.message || error };
    } finally {
      conn.release();
    }
  }

  async filtros(filtro) {
    const sql = 'SELECT id_pro, nombre, descripcion, id_equipo, estado, fecha_creacion, fecha_inicio, fecha_cierre, id_responsable, documento, imagen FROM proyecto WHERE estado = ?';
    try {
      const [res] = await db.query(sql, [filtro]);
      if (!res.length) {
        return { status: 200, mensaje: 'No hay proyectos ' + filtro };
      }
      return { status: 200, mensaje: 'Proyectos consultados con éxito', proyectos: res };
    } catch (error) {
      throw { status: 500, mensaje: error.message || error };
    }
  }

  async crear(datos, files) {
    const { nombre, descripcion, id_equipo, id_responsable } = datos
    const { imagen, documento } = files
    const sql = 'INSERT INTO proyecto (id_pro, nombre, descripcion, id_equipo, id_responsable, documento, imagen) VALUES (?,?,?,?,?,?,?)'
    if (!nombre || !descripcion) {
      return { status: 404, mensaje: 'Datos incompletos' }
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
    try {
      await db.query(sql, insert);
      return { status: 200, mensaje: 'Proyecto creado con éxito' }
    } catch (error) {
      throw { status: 500, mensaje: error.message || error };
    }
  }

  async editar(datos, files) {
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
    try {
      const [res] = await db.query(sql, editPro);
      if (res.affectedRows === 0) {
        return { status: 404, mensaje: 'Proyecto no encontrado' }
      }
      return { status: 200, mensaje: 'Proyecto editado con éxito' }
    } catch (error) {
      throw { status: 500, mensaje: error.message || error };
    }
  }

  async cambiarEstado(datos) {
    const { estado, id_pro } = datos;
    const sql = `UPDATE proyecto SET estado = ? WHERE id_pro = ?`;
    try {
      const [res] = await db.query(sql, [estado, id_pro]);
      if (res.affectedRows === 0) return { status: 404, mensaje: 'Proyecto no encontrado' };
      return { status: 200, mensaje: 'Estado cambiado con éxito' };
    } catch (error) {
      throw { status: 500, mensaje: error.message || error };
    }
  }

  async cambiarLider(datos) {
    const { id_responsable, id_pro } = datos;
    const sql = `UPDATE proyecto SET id_responsable = ? WHERE id_pro = ?`;
    try {
      const [res] = await db.query(sql, [id_responsable, id_pro]);
      if (res.affectedRows === 0) return { status: 404, mensaje: 'Proyecto no encontrado' };
      return { status: 200, mensaje: 'Líder cambiado con éxito' };
    } catch (error) {
      throw { status: 500, mensaje: error.message || error };
    }
  }

  async cambiarEquipo(datos) {
    const { id_equipo, id_pro } = datos
    const sql = `UPDATE proyecto SET id_equipo = ? WHERE id_pro = ?`
    try {
      const [res] = await db.query(sql, [id_equipo, id_pro]);
      if (res.affectedRows === 0) return { status: 404, mensaje: 'Proyecto no encontrado' };
      return { status: 200, mensaje: 'Equipo cambiado con éxito' };
    } catch (error) {
      throw { status: 500, mensaje: error.message || error };
    }
  }

  async cambiarFechas(datos) {
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
    try {
      const [res] = await db.query(sql, edit);
      if (res.affectedRows === 0) return { status: 404, mensaje: 'Proyecto no encontrado' };
      return { status: 200, mensaje: 'Fechas ingresadas con éxito' }
    } catch (error) {
      throw { status: 500, mensaje: error.message || error };
    }
  }

  async eliminar(datos) {
    const { id_pro, imagen, documento } = datos;
    const sql = 'DELETE FROM proyecto WHERE id_pro = ?';

    try {
      const [res] = await db.query(sql, [id_pro]);
      if (res.affectedRows === 0) return { status: 404, mensaje: 'Proyecto no encontrado' };

      if (imagen) {
        try {
          const rutaImagen = path.join(__dirname, '..', 'uploads', 'images', path.basename(imagen));
          await fs.unlink(rutaImagen);
        } catch (e) { console.warn("Imagen no encontrada al borrar"); }
      }
      if (documento) {
        try {
          const rutaDoc = path.join(__dirname, '..', 'uploads', 'documents', path.basename(documento));
          await fs.unlink(rutaDoc);
        } catch (e) { console.warn("Documento no encontrado al borrar"); }
      }

      return { status: 200, mensaje: 'Proyecto eliminado con éxito' };
    } catch (error) {
      throw { status: 500, mensaje: error.message || error };
    }
  }
}

module.exports = new proyectoM();