context('Contact Page', () => {
  before(() => {
    cy.visit('http://localhost:4783/contact')
  })

  it('should render contact form', () => {
    cy.get('[data-test=contact-form]')
  })
})

export {}
