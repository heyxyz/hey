context('Home Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4783')
  })

  it('should render the home page and display welcome message', () => {
    cy.get('h1').contains('Welcome to Lenster 👋')
    cy.get('[data-cy=product-description]').contains(
      'Lenster is a composable, decentralized, and permissionless social media web app built with Lens Protocol 🌿'
    )
  })

  it('should render explore list, recommended users', () => {
    cy.get('[data-cy=explore-feed]')
    cy.get('div').contains('Recommended users')
    cy.get('[data-cy=user-recommendations]>div')
      .children()
      .should('have.length', 5)

    cy.get('[data-cy=user-recommendations]>div')
      .children()
      .closest('div')
      .get('button')
  })
})
export {}
