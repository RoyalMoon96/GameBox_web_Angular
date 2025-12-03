describe('Users', () => {
  it('Landing page works', () => {
    cy.visit('/login')
    cy.contains('Iniciar Sesión')
    cy.get('input[name="email"]').type('testuser1@users.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('button[name="login"]').click()

    cy.contains('Games')

  })
})
