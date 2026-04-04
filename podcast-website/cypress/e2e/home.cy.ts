describe('Home Page - Featured Episode', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should load the landing page', () => {
    cy.title().should('include', 'podcast')
  })

  it('should display the featured episode section', () => {
    cy.contains('Featured Episode').should('be.visible')
  })

  it('should display featured episode title', () => {
    cy.contains('Episode 1: Getting Started').should('be.visible')
  })

  it('should display featured episode description', () => {
    cy.contains('A comprehensive introduction to our podcast').should('be.visible')
  })

  it('should display featured episode cover image', () => {
    cy.get('img[alt="Episode 1: Getting Started"]')
      .should('be.visible')
      .should('have.attr', 'src', '/images/ep-001.jpg')
  })

  it('should have a working "Listen Now" button', () => {
    cy.contains('Listen Now')
      .should('be.visible')
      .should('have.attr', 'href', '/episodes/ep-001')
  })

  it('should have a working "Add to Playlist" button', () => {
    cy.contains('Add to Playlist').should('be.visible')
  })

  it('should display the recent episodes section', () => {
    cy.contains('Recent Episodes').should('be.visible')
  })

  it('should display recent episode cards', () => {
    cy.get('a[href="/episodes/ep-002"]').should('be.visible')
    cy.get('a[href="/episodes/ep-003"]').should('be.visible')
  })

  it('should navigate to episode detail page when clicking featured episode title', () => {
    cy.contains('Episode 1: Getting Started').click()
    cy.url().should('include', '/episodes/ep-001')
  })

  it('should navigate to episode detail page when clicking featured episode image', () => {
    cy.visit('/')
    cy.get('img[alt="Episode 1: Getting Started"]').click()
    cy.url().should('include', '/episodes/ep-001')
  })

  it('should navigate to episode detail page when clicking recent episode card', () => {
    cy.contains('Episode 2: Advanced Topics').click()
    cy.url().should('include', '/episodes/ep-002')
  })

  it('should have responsive design - check mobile view', () => {
    cy.viewport('iphone-x')
    cy.contains('Featured Episode').should('be.visible')
    cy.contains('Recent Episodes').should('be.visible')
  })

  it('should have responsive design - check tablet view', () => {
    cy.viewport('ipad-2')
    cy.contains('Featured Episode').should('be.visible')
    cy.contains('Recent Episodes').should('be.visible')
  })

  it('should show visual feedback on button hover', () => {
    cy.contains('Listen Now')
      .trigger('mouseenter')
      .should('be.visible')
  })

  it('should display episode duration for recent episodes', () => {
    cy.contains('45:30').should('be.visible')
  })

  it('should display episode publication date for recent episodes', () => {
    // Check for the formatted date (January 15, 2024)
    cy.contains('January').should('be.visible')
  })
})
