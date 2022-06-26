context('Home Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4783')
  })

  it('should render required components', () => {
    cy.get('[data-test=app-name]')
    cy.get('[data-test=app-description]')
    cy.get('[data-test=explore-feed]')
    cy.get('[data-test=recommended-users]')
    cy.get('[data-test=beta-warning]')
    cy.get('[data-test=footer]')
  })
})

export {}
