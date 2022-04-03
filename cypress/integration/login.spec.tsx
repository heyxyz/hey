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
  })
})
export {}
