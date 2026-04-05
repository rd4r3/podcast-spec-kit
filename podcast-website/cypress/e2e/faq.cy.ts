describe('FAQ Page', () => {
  beforeEach(() => {
    cy.visit('/faq')
  })

  it('should load the FAQ page', () => {
    cy.title().should('include', 'podcast')
  })

  it('should display the FAQ page title', () => {
    cy.contains('Frequently Asked Questions').should('be.visible')
  })

  it('should display the search input', () => {
    cy.get('input[placeholder="Search FAQs..."]').should('be.visible')
  })

  it('should display category filter buttons', () => {
    cy.contains('All').should('be.visible')
    cy.get('button').should('have.length.greaterThan', 1)
  })

  it('should display FAQ items', () => {
    cy.contains('What is a podcast?').should('be.visible')
  })

  it('should expand FAQ item when clicked', () => {
    cy.contains('What is a podcast?').click()
    cy.contains('A podcast is a series of digital audio or video files').should('be.visible')
  })

  it('should collapse FAQ item when clicked again', () => {
    cy.contains('What is a podcast?').click()
    cy.contains('A podcast is a series of digital audio or video files').should('be.visible')
    cy.contains('What is a podcast?').click()
    cy.contains('A podcast is a series of digital audio or video files').should('not.be.visible')
  })

  it('should filter FAQs by category', () => {
    cy.contains('button', 'General').click()
    cy.contains('What is a podcast?').should('be.visible')
  })

  it('should show all FAQs when clicking All button', () => {
    cy.contains('button', 'General').click()
    cy.contains('button', 'All').click()
    cy.get('.card').should('have.length.greaterThan', 1)
  })

  it('should search FAQs by question text', () => {
    const searchInput = cy.get('input[placeholder="Search FAQs..."]')
    searchInput.type('podcast')
    cy.contains('What is a podcast?').should('be.visible')
  })

  it('should search FAQs by answer text', () => {
    const searchInput = cy.get('input[placeholder="Search FAQs..."]')
    searchInput.type('series of digital')
    cy.contains('What is a podcast?').should('be.visible')
  })

  it('should show empty state when no search results', () => {
    const searchInput = cy.get('input[placeholder="Search FAQs..."]')
    searchInput.type('xyzabc123nonexistent')
    cy.contains('No FAQs found').should('be.visible')
  })

  it('should clear search and show all results', () => {
    const searchInput = cy.get('input[placeholder="Search FAQs..."]')
    searchInput.type('podcast')
    cy.contains('Clear search').click()
    searchInput.should('have.value', '')
  })

  it('should have responsive design - check mobile view', () => {
    cy.viewport('iphone-x')
    cy.contains('Frequently Asked Questions').should('be.visible')
    cy.get('input[placeholder="Search FAQs..."]').should('be.visible')
  })

  it('should have responsive design - check tablet view', () => {
    cy.viewport('ipad-2')
    cy.contains('Frequently Asked Questions').should('be.visible')
    cy.get('button').first().should('be.visible')
  })

  it('should have proper button styling on category filter', () => {
    cy.contains('button', 'All').click()
    cy.contains('button', 'All').should('have.class', 'bg-primary-500')
  })

  it('should show result count when searching', () => {
    const searchInput = cy.get('input[placeholder="Search FAQs..."]')
    searchInput.type('podcast')
    cy.contains(/Found \d+ result/).should('be.visible')
  })

  it('should navigate to FAQ page from navigation', () => {
    cy.visit('/')
    cy.contains('a', 'FAQ').click()
    cy.url().should('include', '/faq')
    cy.contains('Frequently Asked Questions').should('be.visible')
  })

  it('should maintain scroll position when expanding FAQ items', () => {
    cy.scrollTo(0, 0)
    cy.contains('What is a podcast?').click()
    cy.contains('A podcast is a series of digital audio or video files').should('be.visible')
  })

  it('should have proper ARIA labels for accessibility', () => {
    cy.get('input[placeholder="Search FAQs..."]').should('have.attr', 'aria-label', 'Search FAQ items')
  })

  it('should display FAQ items with proper card styling', () => {
    cy.get('.card').first().should('have.class', 'card')
  })
})
