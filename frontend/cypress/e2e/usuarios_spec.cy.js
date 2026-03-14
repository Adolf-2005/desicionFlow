const generarCedula = () => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

describe('CRUD usuarios', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5000/usuarios')
  })

  it('Deberia utilizar el crud', () => {
    const cedula = generarCedula()
    const usuario = `Test_${cedula}`
    const nombre = `Test_${generarCedula()}`
    const apellido = `Test_${generarCedula()}`
    const apellidoCambiado = `Test_${generarCedula()}`

    cy.intercept('GET', 'http://localhost:3000/usuarios').as('crear')

    cy.get('[data-test="usuario"]').type('admin',)
    cy.get('[data-test="clave"]').type('1234',)
    cy.get('[data-test="login"]').click()
    cy.get('[data-test="menu"]').click()
    cy.get('[data-test="Usuarios"]').click({ multiple: true, force: true })

    cy.contains('Crear usuario').click()
    cy.get('[data-test="Nombre"]').type(nombre)
    cy.get('[data-test="Apellido"]').type(apellido)
    cy.get('[data-test="Prefijo"]').click()
      .wait(200)
    cy.get('.v-overlay-container .v-list-item-title').contains('V-').click();
    cy.get('[data-test="Cedula"]').type(cedula)
    cy.get('[data-test="Usuario"]').type(usuario)
    cy.get('[data-test="Contraseña"]').type('1234')
    cy.get('[data-test="Rol del usuario"]').click()
    cy.get('.v-overlay-container .v-list-item-title').contains('Miembro').click()
    cy.get('[type=button]').contains('Crear usuarios').click()

    cy.wait('@crear')

    // cy.get('.v-card').contains(nombre)
    cy.contains('.v-card', nombre).should('be.visible')
    cy.contains('.v-card', nombre).within(() => {
      cy.get('button').contains('Editar').click();
    });
    cy.get('[data-test="Apellido"] input').clear().type(apellidoCambiado)
    cy.get('[type=button]').contains('Editar usuario').click()

    cy.wait('@crear')

    cy.contains('.v-card', nombre).should('be.visible')
    cy.contains('.v-card', nombre).within(() => {
      cy.get('button').contains('Eliminar').click({force:true})
    });
    cy.get('button').contains('Sí').click()
  })

})