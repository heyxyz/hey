context('Publication Page', () => {
  before(() => {
    cy.visit('http://localhost:4783/posts/0x01-0x01')
  })

  it('should render publication', () => {
    cy.get('[data-test=publication]')
  })

  it('should render publication timestamp', () => {
    cy.get('[data-test=publication-timestamp]')
  })

  it('should render publication content', () => {
    cy.get('[data-test=publication]')
  })

  it('should render publication comment button', () => {
    cy.get('[data-test=publication-comment]')
  })

  it('should render publication mirror button', () => {
    cy.get('[data-test=publication-mirror]')
  })

  it('should render publication like button', () => {
    cy.get('[data-test=publication-like]')
  })

  it('should render publication comment button', () => {
    cy.get('[data-test=publication-comment]')
  })

  it('should render publication collect', () => {
    cy.get('[data-test=publication-collect]')
  })

  it('should render publication more', () => {
    cy.get('[data-test=publication-more]')
  })
})

export {}
