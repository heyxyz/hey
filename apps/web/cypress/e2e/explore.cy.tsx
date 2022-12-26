context('Explore Page', () => {
  before(() => {
    cy.visit('http://localhost:4783/explore');
  });

  it('should render footer', () => {
    cy.get('[data-test=footer]');
  });
});

export {};
