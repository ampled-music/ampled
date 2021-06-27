
describe('Ampled Home Page', () => {
  before(() => {
   cy.resetdb()
  })

  it('loads', () => {
    cy.intercept('GET', '/artist_pages.json').as('artist_pages')
    cy.visit('/')
    cy.wait('@artist_pages').then(xhr => cy.log(JSON.stringify(xhr.response.body)))
    cy.contains('Ampled')
    cy.get('.home-artists').parent().scrollIntoView()
    cy.get('.home-artists__title').contains('5 artists')
  })
})
