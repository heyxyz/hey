context('Home Page', () => {
  before(() => {
    cy.visit('http://localhost:4783')
  })

  it('should render app name', () => {
    cy.get('[data-test=app-name]')
  })

  it('should render app description', () => {
    cy.get('[data-test=app-description]')
  })

  it('should render explore feed', () => {
    cy.get('[data-test=explore-feed]')
  })

  it('should render recommended users', () => {
    cy.get('[data-test=recommended-users]')
  })

  it('should render beta warning', () => {
    cy.get('[data-test=beta-warning]')
  })

  it('should render footer', () => {
    cy.get('[data-test=footer]')
  })
})

export {}
