context('Explore Page', () => {
  before(() => {
    cy.visit(Cypress.env('URL') + '/explore');
  });

  it('should render footer', () => {
    cy.get('[data-test=footer]');
  });
});

export {};
