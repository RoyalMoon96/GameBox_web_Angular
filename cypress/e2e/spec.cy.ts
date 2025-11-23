describe('Page loads', () => {
  it('Landing page works', () => {
    cy.visit('/')
    cy.contains('Game Box')
  })
})
