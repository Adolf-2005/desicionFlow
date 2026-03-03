const ideasM = require('../models/ideas')

class ideasC {

  crear(datos) {
    return new Promise(async (resolve, reject) => {
      ideasM.crear(datos)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  editar(datos) {
    return new Promise(async (resolve, reject) => {
      ideasM.editar(datos)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  eliminar(datos) {
    return new Promise(async (resolve, reject) => {
      ideasM.eliminar(datos)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  convertirDecision(datos) {
    return new Promise(async (resolve, reject) => {
      ideasM.convertirDecision(datos)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

}

module.exports = new ideasC();