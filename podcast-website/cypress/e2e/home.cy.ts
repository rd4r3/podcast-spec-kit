describe('Home Page - Featured Episode', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should load the landing page', () => {
    cy.contains('Featured Episode').should('be.visible')
  })

  it('should display the featured episode section', () => {
    cy.contains('Featured Episode').should('be.visible')
  })

  it('should display featured episode title', () => {
    cy.contains('Episode 1: Industry Insights').should('be.visible')
  })

  it('should display featured episode description', () => {
    cy.contains('Exploring fascinating topics').should('be.visible')
  })

  it('should display featured episode cover image', () => {
    cy.get('img[alt="Episode 1: Industry Insights"]')
      .should('be.visible')
      .should('have.attr', 'src', '/images/episodes/ep-001.jpg')
  })

  it('should have a working "Show Notes" button', () => {
    cy.contains('Show Notes')
      .should('be.visible')
      .should('have.attr', 'href', '/episodes/ep-001/')
  })

  // it('should have a working "Add to Playlist" button', () => {
  //   cy.contains('Add to Playlist').should('be.visible')
  // })

  it('should display the recent episodes section', () => {
    cy.contains('Recent Episodes').should('be.visible')
  })

  it('should display recent episode cards', () => {
    cy.get('a[href="/episodes/ep-020/"]').should('be.visible')
    cy.get('a[href="/episodes/ep-019/"]').should('be.visible')
  })

  it('should navigate to episode detail page when clicking featured episode Show Notes', () => {
    cy.get('a[href="/episodes/ep-001/"]').first().click()
    cy.url().should('include', '/episodes/ep-001')
  })

  it('should navigate to episode detail page when clicking recent episode card', () => {
    cy.contains('Episode 20: The Future of Podcasting').click()
    cy.url().should('include', '/episodes/ep-020')
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
    cy.contains('Show Notes')
      .trigger('mouseenter')
      .should('be.visible')
  })

  it('should display episode duration for recent episodes', () => {
    cy.contains('00:35:15').should('be.visible')
  })

  it('should display episode publication date for recent episodes', () => {
    // Check for the formatted date (1/19/2024)
    cy.contains('1/19/2024').should('be.visible')
  })
})
