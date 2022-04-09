context('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should render header', () => {
    cy.get('[data-cy=navbar]').contains('Home')
    cy.get('[data-cy=navbar]').contains('Explore')
    cy.get('[data-cy=navbar]').contains('Communities')
    cy.get('[data-cy=navbar]').contains('More')

    cy.get('[data-cy=navbar]').contains('More').click()
    cy.get('a').contains('Contact')
  })

  it('page navigations', () => {
    cy.get('[data-cy=navbar]').contains('Explore').click()
    cy.location('pathname').should('include', 'explore')
    cy.get('[data-cy=navbar]').contains('Explore').click()
    cy.location('pathname').should('include', 'explore')
  })
})
export {}
