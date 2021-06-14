
describe('Ampled Home Page', () => {
  it('loads', () => {
    cy.visit('/')
    cy.contains('Ampled')
  })
})
