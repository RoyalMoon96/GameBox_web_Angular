const gameSlug="gato"

describe('Game Template', () => {
  it('Landing page works', () => {
    cy.visit('/login')
    cy.contains('Iniciar Sesión')
    cy.get('input[name="email"]').type('testuser1@users.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('button[name="login"]').click()
    cy.get(`#card_cat_All_${gameSlug}`).click()
    cy.contains('About the game')
      cy.on('window:alert', (alertText) => {
      expect(alertText).to.contain('No estás en ninguna sala de juego/chat');
    });
    cy.get('#msg_user_input').type('msg')
    cy.get('#send_msg_btn').type('msg')
  })
})
