context('Crowdfund Page', () => {
  before(() => {
    cy.visit(
      `http://localhost:4783/posts/${
        Cypress.env('is_mainnet') ? '0x24b6-0x03' : '0x15-0x1d'
      }`
    )
  })

  it('should render publication', () => {
    cy.get('[data-test=publication]')
  })

  it('should render crowdfund', () => {
    cy.get('[data-test=crowdfund]')
  })

  it('should render crowdfund meta', () => {
    cy.get('[data-test=crowdfund-meta]')
  })

  it('should render crowdfund progress bar', () => {
    cy.get('[data-test=crowdfund-progress-bar]')
  })
})

export {}
