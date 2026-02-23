var equiposM = require('../models/equiposM')

class equipoC {

  miembros() {
    return new Promise((resolve, reject) => {
      equiposM.miembros()
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  equipos() {
    return new Promise((resolve, reject) => {
      equiposM.equipos()
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  crear(datos) {
    return new Promise((resolve, reject) => {
      equiposM.crear(datos)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  editar(datos) {
    return new Promise((resolve, reject) => {
      equiposM.editar(datos)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }
 
  eliminar(id_equi) {
    return new Promise((resolve, reject) => {
      equiposM.elimiar(id_equi)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }
  
  elimiarMiembro(datos) {
    return new Promise((resolve, reject) => {
      equiposM.elimiarMiembro(datos)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

}

module.exports = new equipoC();