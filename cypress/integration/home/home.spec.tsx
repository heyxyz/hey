context('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should render the home page and display welcome message', () => {
    cy.get('h1').contains('Welcome to Lenster 👋')
    cy.get('[data-cy=product-description]').contains(
      'Lenster is a composable, decentralized, and permissionless social media web app built with Lens Protocol 🌿'
    )
  })

  it('should render explore list, recommended users and announcement', () => {
    cy.get('[data-cy=explore-feed]')
    cy.get('[data-cy=beta-announcement]').contains('Beta warning!')
    cy.get('[data-cy=beta-announcement]').contains(
      'Lenster is still in the beta phase and all contents are stored in Mumbai testnet.'
    )
    cy.get('[data-cy=beta-announcement]').contains('Get testnet tokens')
    cy.get('[data-cy=beta-announcement]')
      .find('a')
      .should('have.attr', 'href', 'https://faucet.polygon.technology/')

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
