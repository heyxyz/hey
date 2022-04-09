import {
  GITLAB_URL,
  OPEN_ANAYTICS_PAGE_URL,
  STATUS_PAGE_URL,
  VERCEL_REF_URL
} from 'src/constants'

context('Home Page Footer', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should render footer', () => {
    cy.get('footer').contains(/Lenster/)
    cy.get('footer').contains('About')
    cy.get('footer').contains('Terms')
    cy.get('footer').contains('Privacy')
    cy.get('footer').contains('Discord')
    cy.get('footer').contains('Status')
    cy.get('footer').contains('Open')
    cy.get('footer').contains('Thanks')
    cy.get('footer').contains(/Gitlab/i)
    cy.get('footer').contains(/Powered by Vercel/)
  })

  it('should navigate to right pages', () => {
    cy.get('footer').contains('About').click()
    cy.location('pathname').should('include', 'about')
    cy.visit('/')
    cy.get('footer').contains('Terms').click()
    cy.location('pathname').should('include', 'terms')
    cy.visit('/')
    cy.get('footer').contains('Privacy').click()
    cy.location('pathname').should('include', 'privacy')
    cy.visit('/')
    cy.get('footer').contains('Discord').click()
    cy.location('pathname').should('include', 'discord')
    cy.visit('/')
    cy.get('footer').contains('Status').click()
    cy.location('pathname').should('include', STATUS_PAGE_URL)
    cy.visit('/')
    cy.get('footer').contains('Open').click()
    cy.location('pathname').should('include', OPEN_ANAYTICS_PAGE_URL)
    cy.visit('/')
    cy.get('footer')
      .contains(/Gitlab/i)
      .click()
    cy.location('pathname').should('include', GITLAB_URL)
    cy.visit('/')
    cy.get('footer').contains('Thanks').click()
    cy.location('pathname').should('include', 'thanks')
    cy.visit('/')
    cy.get('footer')
      .contains(/Powered by Vercel/)
      .click()
    cy.location('pathname').should('include', VERCEL_REF_URL)
  })
})
export {}
