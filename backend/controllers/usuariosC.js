const usuariosM = require('../models/usuariosM')

class usuariosC {

  todos() {
    return new Promise((resolve, reject) => {
      usuariosM.todos()
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  busqueda() {
    return new Promise((resolve, reject) => {
      usuariosM.todos()
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  crear(user) {
    return new Promise(async (resolve, reject) => {
      usuariosM.crear(user)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  login(user) {
    return new Promise(async (resolve, reject) => {
      usuariosM.login(user)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  cambioClave(datos) {
    return new Promise(async (resolve, reject) => {
      usuariosM.cambioClave(datos)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  editar(user) {
    return new Promise((resolve, reject) => {
      usuariosM.editar(user)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  eliminar(id_usu) {
    return new Promise((resolve, reject) => {
      usuariosM.eliminar(id_usu)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
           reject(err)
        });
    })
  }
}

module.exports = new usuariosC();