context('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should render the home page and display welcome message', () => {
    cy.get('h1').contains('Welcome to Lenster 👋')
  })

  it('should render login modal', () => {
    cy.get('[data-cy=login]').click()
    cy.get('div').contains('Login')
    cy.get('div').contains(
      'Connect with one of our available wallet providers or create a new one.'
    )
    cy.get('[data-cy=wallet-options]').children().should('have.length', 3)

    cy.get('[data-cy=wallet-options]')
      .find('button')
      .contains(/WalletConnect/i)
    cy.get('[data-cy=wallet-options]')
      .find('button')
      .contains(/Coinbase wallet/i)
  })

  it('should close login modal', () => {
    cy.get('[data-cy=login]').click()
    cy.get('div').contains('Login')
    cy.get('[data-cy=close-login]').click()
    cy.get('div').not('Login')
  })
})
export {}
