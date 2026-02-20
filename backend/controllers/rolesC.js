const rolesM = require('../models/rolesM')

class rolesC {

  roles() {
    return new Promise((resolve, reject) => {
      rolesM.roles()
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  crear(nombre) {
    return new Promise(async (resolve, reject) => {
      rolesM.crear(nombre)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  editar(datos) {
    return new Promise((resolve, reject) => {
      rolesM.editar (datos)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

}

module.exports = new rolesC();