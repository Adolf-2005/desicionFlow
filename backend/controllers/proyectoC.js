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

  uno(id_pro) {
    return new Promise((resolve, reject) => {
      proyectoM.uno(id_pro)
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
  
  cambiarLider(datos) {
    return new Promise((resolve, reject) => {
      proyectoM.cambiarLider(datos)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  cambiarEquipo(datos) {
    return new Promise((resolve, reject) => {
      proyectoM.cambiarEquipo(datos)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }
 
  cambiarFechas(datos) {
    return new Promise((resolve, reject) => {
      proyectoM.cambiarFechas(datos)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }

  eliminar(datos) {
    return new Promise((resolve, reject) => {
      proyectoM.eliminar(datos)
        .then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        });
    })
  }
}

module.exports = new proyectoC();