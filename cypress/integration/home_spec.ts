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

  it('can view an artist page logged out', () => {
    cy.visit('/browse')
    cy.get('.home-artists__artists_all_group a').first().click()
  })

  it('can sign up as a supporter', () => {
    cy.visit('/')
    cy.get('button:contains("Login")').click()
    cy.get('button:contains("Sign up")').click()
    cy.get('input[name="name"]').type('Ampled')
    cy.get('input[name="last_name"]').type('User')
    cy.get('input[name="email"]').type('cypress@ampled.com')
    cy.get('input[name="password"]').type('Pass1234')
    cy.get('input[name="confirmPassword"]').type('Pass1234')
    cy.get('input[name="terms"]').check()
    cy.get('button[type="submit"]').click()
    cy.get('#toast-container').should('contain.text', 'Signed up!')
    cy.logout()
  })

  it('can log in using the previously created account', () => {
    cy.visit('/')
    cy.get('button:contains("Login")').click()
    cy.get('input[name="email"]').type('cypress@ampled.com')
    cy.get('input[name="password"]').type('Pass1234')
    cy.get('button[type="submit"]').click()
    cy.get('#toast-container').should('contain.text', 'Welcome back!')
    cy.logout()
  })

  it('can view and support an artist page logged in', () => {
    cy.visit('/')
    cy.get('button:contains("Login")').click()
    cy.get('input[name="email"]').type('cypress@ampled.com')
    cy.get('input[name="password"]').type('Pass1234')
    cy.get('button[type="submit"]').click()
    cy.get('#toast-container').should('contain.text', 'Welcome back!')
    cy.visit('/browse')
    cy.get('.home-artists__artists_all_group a').first().click()
    cy.get('button:contains("Support")').first().click()
    cy.get('input[name="supportLevelValue"]').type('3')
    cy.get('.support__action button').click()
    cy.getWithinIframe('iframe[title="Secure card number input frame"]','input[name="cardnumber"]').type('4111111111111111')
    cy.getWithinIframe('iframe[title="Secure expiration date input frame"]','input[name="exp-date"]').type('1224')
    cy.getWithinIframe('iframe[title="Secure CVC input frame"]','input[name="cvc"]').type('123')
    cy.get('button:contains("Support")').first().click()
    // TODO: need to make dummy artists supportable
    cy.get('#toast-container').should('exist')
  })
})
