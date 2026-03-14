describe('Ingresando al login', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5000/')
  })
  it('Debería permitir al usuario iniciar sesión', () => {
    cy.get('[data-test="usuario"]').type('admin', { delay: 200 })
    cy.get('[data-test="clave"]').type('1345', { delay: 200 })
    cy.get('[data-test="ver"]')
      .trigger('mousedown')
      .wait(500)
      .trigger('mouseup')
    cy.get('[data-test="clave"] input').clear().type('1234', { delay: 200 })
    cy.get('[data-test="ver"]')
      .trigger('mousedown')
      .wait(500)
      .trigger('mouseup')
    cy.get('[data-test="login"]').click()
  })
})