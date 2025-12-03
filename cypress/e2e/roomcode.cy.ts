describe('Room Code: Display', () => {
  it('Should show room code when creating room', () => {
    const gameSlug = 'gato'

    cy.visit('/login')
    cy.get('input[name="email"]').type('testuser1@users.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('button[name="login"]').click()

    cy.get(`#card_cat_All_${gameSlug}`).click()
    cy.contains('About the game')

    cy.wait(3000)

    cy.get('.game-frame').then(($iframe) => {
      const iframe = $iframe.contents()

      cy.wrap(iframe.find('button:contains("Crear sala (Host)")').first()).click()

      cy.wait(2000)

      cy.wrap(iframe.find('body')).contains('Sala:').should('be.visible')
      cy.wrap(iframe.find('body')).contains('Sala creada').should('be.visible')
      cy.wrap(iframe.find('body')).contains('Rol: Host').should('be.visible')
    })

    cy.window().then((win) => {
      const roomCode = win.localStorage.getItem('room')
      expect(roomCode).to.not.be.null
      expect(roomCode).to.not.be.empty

      cy.log(`Room Code Generated: ${roomCode}`)
    })
  })
})
