context('Home Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4783/u/lensprotocol')
  })

  it('should render required components', () => {
    cy.get('[data-test=profile-cover]')
    cy.get('[data-test=profile-avatar]')
    cy.get('[data-test=profile-name]')
    cy.get('[data-test=profile-slug]')
    cy.get('[data-test=profile-follow]')
    cy.get('[data-test=profile-following]')
    cy.get('[data-test=profile-followers]')
    cy.get('[data-test=profile-meta]')
    cy.get('[data-test=profile-follow]')
    cy.get('[data-test=profile-follow]')
    cy.get('[data-test=profile-follow]')
  })
})

export {}
