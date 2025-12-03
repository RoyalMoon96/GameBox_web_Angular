describe('Logout', () => {
  const user = {"username":"testuser1","userid":"1","email":"testuser1@users.com","img":"A"}
  it('Landing page works', () => {
    cy.visit('/login')
    cy.contains('Iniciar Sesión')
    cy.get('input[name="email"]').type(user.email)
    cy.get('input[name="password"]').type('password123')
    cy.get('button[name="login"]').click()
    
    cy.get('#user_info').click()
    cy.get('#userName').should('have.text', user.username);
    cy.get('#email').should('have.text', user.email);
    cy.get('#logout_btn').click()
    cy.url().should('include', '/login');
    cy.location('pathname').should('eq', '/login');
  })
})
