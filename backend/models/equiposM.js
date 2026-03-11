const { v4: uuidv4 } = require('uuid');
const db = require('../database/connection');

class equipoM {

  async miembros() {
    const sql = 'SELECT id_usu, nombre, apellido, usuario, cedula FROM usuarios WHERE rol = ?'
    try {
      const [res] = await db.query(sql, ['Miembro'])
      if (res.length === 0) {
        return { status: 200, mensaje: 'No miembros registrados', miembros: res }
      }
      return { status: 200, mensaje: 'Exito de consulta', miembros: res }
    } catch (error) {
      throw { status: 500, mensaje: error };
    }
  }

  async equipos() {
    const sql = 'SELECT * FROM equipos'
    const sqlMiembro = 'SELECT m.id_equi, m.id_usu, m.rol, m.fecha_ingreso, u.nombre, u.apellido, u.usuario, u.cedula FROM miembros m INNER JOIN usuarios u ON u.id_usu = m.id_usu'
    const conect = await db.getConnection()
    try {
      await conect.beginTransaction()
      const [miembros] = await conect.query(sqlMiembro)
      const [equipos] = await conect.query(sql)
      if (miembros.length === 0) {
        return { status: 200, mensaje: 'No miembros registrados', miembros: miembros }
      }
      if (equipos.length === 0) {
        return { status: 200, mensaje: 'No datos registrados', equipos: equipos }
      }
      equipos.forEach(e => {
        e.miembros = miembros.filter(m => m.id_equi == e.id_equi);
      });
      await conect.commit();
      return { status: 200, mensaje: 'Exito de consulta', equipos: equipos }

    } catch (error) {
      await connection.rollback();
      return { status: 500, mensaje: error }
    }
  }

  async crear(datos) {
    const { nombre, descripcion, id_responsable, miembros } = datos
    const sql = 'INSERT INTO equipos (id_equi, nombre, descripcion, id_responsable) VALUES (?,?,?,?)'
    const sqlMiembro = 'INSERT INTO miembros (id_equi, id_usu, rol) VALUES ?'
    const id = uuidv4()
    const insert = [id, nombre, descripcion, id_responsable]
    let lista = []
    const conect = await db.getConnection()
    try {
      await conect.beginTransaction()
      const [result] = await conect.query(sql, insert)
      for (const m of miembros) {
        lista.push([id, m.id_usu, m.rol])
      }
      const [resMiem] = await conect.query(sqlMiembro, [lista])
      await conect.commit();
      return { mensaje: 'Exito', status: 201 }
    } catch (error) {
      await connection.rollback();
      return { status: 500, mensaje: error }
    }
  }

  async editar(datos) {
    const { id_equi, nombre, descripcion, id_responsable, miembros } = datos
    const sqlUpdateEquipo = 'UPDATE equipos SET nombre = ?, descripcion = ?, id_responsable = ? WHERE id_equi = ?'
    const sqlMiembrosAct = 'SELECT id_usu FROM miembros WHERE id_equi = ?'
    const conect = await db.getConnection()
    try {
      await conect.beginTransaction()
      await conect.query(sqlUpdateEquipo, [nombre, descripcion, id_responsable, id_equi])
      const [miembrosActuales] = await conect.query(sqlMiembrosAct, [id_equi])
      const lista = miembrosActuales.map(m => m.id_usu)
      const idsNuevos = miembros.map(m => m.id_usu);
      const aEliminar = lista.filter(id => !idsNuevos.includes(id));
      const aInsertar = miembros.filter(m => !lista.includes(m.id_usu));
      if (aEliminar.length > 0) {
        await conect.query('DELETE FROM miembros WHERE id_equi = ? AND id_usu IN (?)', [id_equi, aEliminar])
      }
      if (aInsertar.length > 0) {
        const sqlInsert = 'INSERT INTO miembros (id_equi, id_usu, rol) VALUES ?';
        const valores = aInsertar.map(m => [id_equi, m.id_usu, m.rol]);
        await conect.query(sqlInsert, [valores])
      }
      const permanecen = miembros.filter(m => lista.includes(m.id_usu));
      for (const m of permanecen) {
        await conect.query('UPDATE miembros SET rol = ? WHERE id_equi = ? AND id_usu = ?', [m.rol, id_equi, m.id_usu])
      }
      await conect.commit()
      return { mensaje: 'Equipo actualizado con éxito', status: 200 }
    } catch (error) {
      await connection.rollback();
      return { status: 500, mensaje: error }
    }
  }

  async elimiar(id_equi) {
    const sql = 'DELETE FROM equipos WHERE id_equi = ?'
    if (!id_equi) {
      return { status: 404, mensaje: 'Datos incompletos' }
    }
    try {
      const [res] = await db.query(sql, [id_equi])
      if (res.affectedRows === 0) {
        return { status: 404, mensaje: 'Equipo no encontrado' }
      }
      return { status: 200, mensaje: 'Equipo eliminado con éxito' }
    } catch (error) {
      throw { status: 500, mensaje: error };
    }
  }

  async elimiarMiembro(datos) {
    const { id_usu_equi, id_equi } = datos
    const sql = 'DELETE FROM miembros WHERE id_usu = ? AND id_equi = ?'
    if (!id_usu_equi || !id_equi) {
      return { status: 400, mensaje: 'Faltan datos' };
    }
    try {
      console.log({id_usu_equi, id_equi})
      const [res] = await db.query(sql, [id_usu_equi, id_equi])
      if (res.affectedRows === 0) {
        return { status: 404, mensaje: 'Miembro no encontrado' }
      }
      return { status: 200, mensaje: 'Miembro eliminado con éxito' }
    } catch (error) {
      throw { status: 500, mensaje: error };
    }
  }

}

module.exports = new equipoM();