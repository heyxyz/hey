import { APP_NAME } from 'src/constants'

context('Home Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4783')
  })

  it('should render the home page and display welcome message', () => {
    cy.get('[data-test=app-name]').contains(`Welcome to ${APP_NAME} 👋`)
    cy.get('[data-test=app-description]').contains(
      `${APP_NAME} is a decentralized, and permissionless social media app built with Lens Protocol 🌿`
    )
  })

  it('should render explore list, recommended users', () => {
    cy.get('[data-test=explore-feed]')
    cy.get('div').contains('Recommended users')
    cy.get('[data-test=recommended-users]>div')
      .children()
      .should('have.length', 5)

    cy.get('[data-test=recommended-users]>div')
      .children()
      .closest('div')
      .get('button')
  })
})
export {}
