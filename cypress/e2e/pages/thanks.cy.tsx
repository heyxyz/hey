context('Thanks Page', () => {
  before(() => {
    cy.visit('http://localhost:4783/thanks')
  })

  it('should render thanks', () => {
    cy.get('[data-test=thanks-content]')
  })
})

export {}
