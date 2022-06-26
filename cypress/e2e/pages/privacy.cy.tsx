context('Privacy Page', () => {
  before(() => {
    cy.visit('http://localhost:4783/privacy')
  })

  it('should render privacy', () => {
    cy.get('[data-test=privacy-content]')
  })
})

export {}
