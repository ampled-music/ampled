// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

declare namespace Cypress {
  interface Chainable {
    resetdb(): Chainable<Element>
    logout(): Chainable<Element>
  }
}

/**
 * Resets the server database and seeds it with well-known test data.
 *
 * @example cy.resetdb()
 */
Cypress.Commands.add('resetdb', () => {
  // Hit the backend directly for a database reset.
  cy.request('GET', `${Cypress.env('apiBase')}/test/reset_database`)
})

Cypress.Commands.add('logout', () => {
  cy.get('div.menu').click()
  cy.get('button:contains("Logout")').click()
  cy.location('pathname').should('eq', '/')
})