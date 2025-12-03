describe('Guard: auth', () => {
  const user = {"username":"MyUserName","userid":"1","email":"user@user.com","img":"A"}
  it('Landing page works', () => {
    cy.visit('/login')
    cy.contains('Iniciar Sesión')
    cy.get('input[name="email"]').type('testuser1@users.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('button[name="login"]').click()
    
    cy.window().its('localStorage.token').should('exist');
    cy.window().its('localStorage.user').should('exist');
    cy.get('#home_btn').click()
    cy.contains('Games')
    cy.clearLocalStorage();
    cy.get('#stats_btn').click()
    cy.contains('Iniciar Sesión')
  })
})
