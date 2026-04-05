describe('Episodes List Page', () => {
  beforeEach(() => {
    cy.visit('/episodes/')
  })

  it('should load the episodes list page', () => {
    cy.contains('All Episodes').should('be.visible')
  })

  it('should display the page heading', () => {
    cy.contains('All Episodes').should('be.visible')
  })

  it('should display episode cards', () => {
    cy.get('.card').should('have.length.greaterThan', 15)
  })

  it('should display episode titles', () => {
    cy.contains('Episode').should('be.visible')
  })

  it('should display episode cover images', () => {
    cy.get('img[alt*="Episode"]').should('have.length.greaterThan', 15)
  })

  it('should display episode descriptions', () => {
    cy.contains('Exploring fascinating topics').should('be.visible')
  })

  it('should display episode metadata (date and duration)', () => {
    cy.contains(/\d{1,2}:\d{2}/).should('be.visible')
  })

  it('should navigate to episode detail page when clicking episode card', () => {
    cy.get('.card').first().click()
    cy.url().should('include', '/episodes/ep-')
  })

  it('should navigate to specific episode when clicking a card', () => {
    cy.get('a[href*="/episodes/ep-001"]').first().click()
    cy.url().should('include', '/episodes/ep-001')
  })

  it('should have responsive design on mobile', () => {
    cy.viewport('iphone-x')
    cy.contains('All Episodes').should('be.visible')
    cy.get('.card').should('have.length.greaterThan', 15)
  })

  it('should have responsive design on tablet', () => {
    cy.viewport('ipad-2')
    cy.contains('All Episodes').should('be.visible')
    cy.get('.card').should('have.length.greaterThan', 15)
  })

  it('should apply hover effects to cards', () => {
    cy.get('.card').first().trigger('mouseenter').should('be.visible')
  })

  it('should display cards in a grid layout', () => {
    cy.get('.grid').should('exist').should('have.class', 'grid-cols-1')
  })

  it('should load all images without errors', () => {
    cy.get('img[alt*="Episode"]').each(($img) => {
      cy.wrap($img).should('be.visible')
      cy.wrap($img).should('have.attr', 'src')
    })
  })

  it('should navigate back from episode detail to episodes list', () => {
    cy.get('.card').first().click()
    cy.url().should('include', '/episodes/ep-')
    cy.contains('Back to Episodes').click()
    cy.url().should('include', '/episodes')
    cy.contains('All Episodes').should('be.visible')
  })

  it('should display consistent card styling', () => {
    cy.get('.card').each(($card) => {
      cy.wrap($card).should('have.class', 'hover:shadow-xl')
      cy.wrap($card).should('have.class', 'hover:scale-105')
    })
  })
})
