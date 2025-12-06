describe('Navigation: Complete Flow', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[name="email"]').type('testuser1@users.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('button[name="login"]').click()
  })

  it('Should navigate through all main sections', () => {
    cy.get('#home_btn').click()
    cy.url().should('include', '/home')
    cy.contains('Games')

    cy.get('#stats_btn').click()
    cy.url().should('include', '/stats')
    cy.contains('My Stats')

    cy.get('#user_info').click()
    cy.get('#settings_btn').click()
    cy.url().should('include', '/user-settings')
    cy.contains('Configuración de Usuario')

    cy.get('.logo').click()
    cy.url().should('include', '/home')
  })

  it('Should navigate to register from login', () => {
    cy.get('#user_info').click()
    cy.get('#logout_btn').click()

    cy.contains('Regístrate aquí').click()
    cy.url().should('include', '/register')
    cy.contains('Crear Cuenta')
  })
})
