describe('Stats: PDF Export', () => {
  it('Should click download button and export PDF', () => {
    cy.visit('/login')
    cy.get('input[name="email"]').type('testuser1@users.com')
    cy.get('input[name="password"]').type('password123')
    cy.get('button[name="login"]').click()

    cy.get('#stats_btn').click()
    cy.contains('My Stats')

    cy.contains('Total Wins:')
    cy.contains('Matches:')
    cy.get('.matches-container').should('be.visible')

    cy.get('button[matMiniFab]').should('be.visible')
    cy.get('mat-icon').contains('download').should('be.visible')
    cy.get('button[matMiniFab]').click()
  })
})
