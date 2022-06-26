context('Communities Page', () => {
  before(() => {
    cy.visit('http://localhost:4783/communities')
  })

  it('should render most active communities', () => {
    cy.get('[data-test=most-active-communities]')
  })

  it('should render fastest growing communities', () => {
    cy.get('[data-test=fastest-growing-communities]')
  })

  it('should render latest communities', () => {
    cy.get('[data-test=latest-communities]')
  })
})

export {}
