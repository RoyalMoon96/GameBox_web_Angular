describe('Users', () => {
  it('user loging and config works', () => {
    const user = {"username":"testuser1","userid":"1","email":"testuser1@users.com","img":"A"}

    cy.visit('/login')
    cy.contains('Iniciar Sesión')
    cy.get('input[name="email"]').type('testuser1@users.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('button[name="login"]').click()

    cy.contains('Games')
    
    cy.get('#user_info').click()
    cy.get('#userName').should('have.text', user.username);
    cy.get('#email').should('have.text', user.email);
    cy.get('#settings_btn').click()
    cy.url().should('include', '/user-settings');
    cy.location('pathname').should('eq', '/user-settings');
    cy.contains('Configuración de Usuario')

  })
})
