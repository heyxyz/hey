context('Profile Page', () => {
  before(() => {
    cy.visit(
      `http://localhost:4783/u/yoginth${
        Cypress.env('is_mainnet') ? '.lens' : '.test'
      }`
    )
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

  it('should render profile feed', () => {
    cy.get('[data-test=profile-feed]')
  })

  it('should render type - posts', () => {
    cy.get('[data-test=type-posts]')
  })

  it('should render type - comments', () => {
    cy.get('[data-test=type-comments]')
  })

  it('should render type - mirrors', () => {
    cy.get('[data-test=type-mirrors]')
  })

  it('should render type - nfts', () => {
    cy.get('[data-test=type-nfts]')
  })
})

export {}
