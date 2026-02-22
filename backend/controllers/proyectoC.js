const proyectoM = require('../models/proyectoM')

class proyectoC {

  todos() {
    return new Promise((resolve, reject) => {
      proyectoM.todos()
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  filtros(filtro) {
    return new Promise((resolve, reject) => {
      proyectoM.filtros(filtro)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  uno() {
    return new Promise((resolve, reject) => {
      proyectoM.uno()
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  crear(datos, files) {
    return new Promise((resolve, reject) => {
      proyectoM.crear(datos, files)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  editar(datos, files) {
    return new Promise((resolve, reject) => {
      proyectoM.editar(datos, files)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  cambiarEstado(datos) {
    return new Promise((resolve, reject) => {
      proyectoM.cambiarEstado(datos)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  actualizarImagen() {
    return new Promise((resolve, reject) => {
      proyectoM.actualizarImagen()
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  actualizarDocumento() {
    return new Promise((resolve, reject) => {
      proyectoM.actualizarDocumento()
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

}

module.exports = new proyectoC();