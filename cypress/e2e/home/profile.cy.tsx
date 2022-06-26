context('Home Page', () => {
  before(() => {
    cy.visit('http://localhost:4783/u/lensprotocol')
  })

  it('should render profile cover', () => {
    cy.get('[data-test=profile-cover]')
  })

  it('should render profile avatar', () => {
    cy.get('[data-test=profile-avatar]')
  })

  it('should render profile name', () => {
    cy.get('[data-test=profile-name]')
  })

  it('should render profile slug', () => {
    cy.get('[data-test=profile-slug]')
  })

  it('should render profile follow', () => {
    cy.get('[data-test=profile-follow]')
  })

  it('should render profile followering', () => {
    cy.get('[data-test=profile-following]')
    cy.get('[data-test=profile-followers]')
  })

  it('should render profile meta', () => {
    cy.get('[data-test=profile-meta]')
  })
})

export {}
