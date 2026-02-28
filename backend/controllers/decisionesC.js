const decisionesM = require('../models/decisionesM')

class decisionesC {

  crear(datos) {
    return new Promise((resolve, reject) => {
      decisionesM.crear(datos)
      .then((result) => {
        resolve(result)
      }).catch((err) => {
        reject(err)
      });
    })
  }

  editar(datos) {
    return new Promise((resolve, reject) => {
      decisionesM.editar(datos)
      .then((result) => {
        resolve(result)
      }).catch((err) => {
        reject(err)
      });
    })
  }

  eliminar(datos) {
    return new Promise((resolve, reject) => {
      decisionesM.eliminar(datos)
      .then((result) => {
        resolve(result)
      }).catch((err) => {
        reject(err)
      });
    })
  }
  
  cambiarEstado(datos) {
    return new Promise((resolve, reject) => {
      decisionesM.cambiarEstado(datos)
      .then((result) => {
        resolve(result)
      }).catch((err) => {
        reject(err)
      });
    })
  }

}

module.exports = new decisionesC();