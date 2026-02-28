const comentariosM = require('../models/comentariosM')

class comentariosC {

  crearComentario(datos) {
    return new Promise((resolve, reject) => {
      comentariosM.crearComentario(datos)
      .then((result) => {
        resolve(result)
      }).catch((err) => {
        reject(err)
      });
    })
  }

  editar(datos) {
    return new Promise((resolve, reject) => {
      comentariosM.editar(datos)
      .then((result) => {
        resolve(result)
      }).catch((err) => {
        reject(err)
      });
    })
  }

  eliminar(datos) {
    return new Promise((resolve, reject) => {
      comentariosM.eliminar(datos)
      .then((result) => {
        resolve(result)
      }).catch((err) => {
        reject(err)
      });
    })
  }
  
  cambiarEstado(datos) {
    return new Promise((resolve, reject) => {
      comentariosM.cambiarEstado(datos)
      .then((result) => {
        resolve(result)
      }).catch((err) => {
        reject(err)
      });
    })
  }

}

module.exports = new comentariosC();