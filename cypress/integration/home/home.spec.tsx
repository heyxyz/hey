context('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should render the home page and display welcome message', () => {
    cy.get('h1').contains('Welcome to Lenster 👋')
  })

  it('should render explore list', () => {
    cy.get('[data-cy=explore-feed]')
  })
})
export {}
