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

  crearComentarioIdea(datos) {
    return new Promise((resolve, reject) => {
      comentariosM.crearComentarioIdea(datos)
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

  eliminarComIdea(datos) {
    return new Promise((resolve, reject) => {
      comentariosM.eliminarComIdea(datos)
      .then((result) => {
        resolve(result)
      }).catch((err) => {
        reject(err)
      });
    })
  }

  eliminarComDec(datos) {
    return new Promise((resolve, reject) => {
      comentariosM.eliminarComIdea(datos)
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