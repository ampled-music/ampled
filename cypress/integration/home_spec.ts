
describe('Ampled Home Page', () => {
  before(() => {
   cy.resetdb()
  })

  it('loads', () => {
    cy.visit('/')
    cy.contains('Ampled')
    cy.get('.home-artists__title').contains('5 artists')
  })
})
