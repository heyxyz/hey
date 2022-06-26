import { IS_MAINNET } from 'src/constants'

context('Profile Page', () => {
  before(() => {
    cy.visit(`http://localhost:4783/u/yoginth${IS_MAINNET ? '.lens' : '.test'}`)
  })

  it('should render profile cover', () => {
    cy.get('[data-test=profile-cover]')
  })

  it('should render profile avatar', () => {
    cy.get('[data-test=profile-avatar]')
  })

  it('should render profile name', () => {
    cy.get('[data-test=profile-name]')
  })

  it('should render profile slug', () => {
    cy.get('[data-test=profile-slug]')
  })

  it('should render profile follow', () => {
    cy.get('[data-test=profile-follow]')
  })

  it('should render profile followering', () => {
    cy.get('[data-test=profile-following]')
    cy.get('[data-test=profile-followers]')
  })

  it('should render profile meta', () => {
    cy.get('[data-test=profile-meta]')
  })

  it('should render profile feed', () => {
    cy.get('[data-test=profile-feed]')
  })
})

export {}
