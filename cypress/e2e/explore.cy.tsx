context('Explore Page', () => {
  before(() => {
    cy.visit('http://localhost:4783/explore')
  })

  it('should render explore feed', () => {
    cy.get('[data-test=explore-feed]')
  })

  it('should render type - top commented', () => {
    cy.get('[data-test=type-top-commented]')
  })

  it('should render type - top collected', () => {
    cy.get('[data-test=type-top-collected]')
  })

  it('should render type - top mirrored', () => {
    cy.get('[data-test=type-top-mirrored]')
  })

  it('should render type - latest', () => {
    cy.get('[data-test=type-latest]')
  })

  it('should render recommended users', () => {
    cy.get('[data-test=recommended-users]')
  })

  it('should render footer', () => {
    cy.get('[data-test=footer]')
  })
})

export {}
