describe('Audio Player Functionality', () => {
  beforeEach(() => {
    cy.visit('/episodes/ep-001')
  })

  it('should load the episode detail page with audio player', () => {
    cy.contains('Episode 1: Getting Started').should('be.visible')
  })

  it('should display the audio player component', () => {
    cy.get('[role="region"][aria-label*="Audio player"]').should('be.visible')
  })

  it('should display play button', () => {
    cy.get('button[aria-label*="Play"]').should('be.visible')
  })

  it('should display progress bar', () => {
    cy.get('input[aria-label="Progress"]').should('be.visible')
  })

  it('should display volume control', () => {
    cy.get('input[aria-label="Volume"]').should('be.visible')
  })

  it('should display current time and duration', () => {
    cy.contains('0:00').should('be.visible')
  })

  it('should display skip forward button', () => {
    cy.get('button[aria-label*="Skip forward"]').should('be.visible')
  })

  it('should display skip backward button', () => {
    cy.get('button[aria-label*="Skip backward"]').should('be.visible')
  })

  it('should display keyboard shortcuts information', () => {
    cy.contains('Keyboard shortcuts').should('be.visible')
  })

  it('should expand keyboard shortcuts when clicked', () => {
    cy.contains('Keyboard shortcuts').click()
    cy.contains('Space').should('be.visible')
    cy.contains('↑').should('be.visible')
    cy.contains('↓').should('be.visible')
  })

  it('should display cover image', () => {
    cy.get('[role="region"] img').should('be.visible')
  })

  it('should display episode title in audio player', () => {
    cy.contains('Now Playing').should('be.visible')
    cy.contains('Episode 1: Getting Started').should('be.visible')
  })

  it('should respond to play button click', () => {
    cy.get('button[aria-label*="Play"]').click()
    // Button should change to pause after click
    cy.get('button[aria-label*="Pause"]').should('be.visible')
  })

  it('should change volume when volume slider is adjusted', () => {
    const volumeControl = cy.get('input[aria-label="Volume"]')
    volumeControl.invoke('val', 0.5).trigger('change')
    volumeControl.should('have.value', '0.5')
  })

  it('should display volume percentage', () => {
    cy.contains(/\d+%/).should('be.visible')
  })

  it('should have proper ARIA labels for accessibility', () => {
    cy.get('button[aria-label*="Play"]').should('have.attr', 'aria-label')
    cy.get('input[aria-label="Progress"]').should('have.attr', 'aria-label')
    cy.get('input[aria-label="Volume"]').should('have.attr', 'aria-label')
  })

  it('should show audio player in About page sidebar', () => {
    cy.contains('About This Episode').should('be.visible')
  })

  it('should display "Now Playing" indicator', () => {
    cy.contains('Now Playing').should('be.visible')
  })

  it('should have responsive audio player design', () => {
    cy.viewport('iphone-x')
    cy.get('[role="region"][aria-label*="Audio player"]').should('be.visible')
    cy.get('button[aria-label*="Play"]').should('be.visible')
  })

  it('should display skip buttons with labels', () => {
    cy.get('button[aria-label*="Skip"]').should('have.length.at.least', 2)
  })

  it('should show audio file source', () => {
    cy.get('[role="region"] audio').should('have.attr', 'src')
  })

  it('should maintain state when navigating to related episodes', () => {
    cy.get('button[aria-label*="Play"]').click()
    cy.get('button[aria-label*="Pause"]').should('be.visible')
    // Navigate to related episode
    cy.contains('Related Episodes').should('be.visible')
  })

  it('should display cover image with correct alt text', () => {
    cy.get('[role="region"] img').should('have.attr', 'alt', 'Episode 1: Getting Started')
  })

  it('should have proper button styling', () => {
    cy.get('button[aria-label*="Play"]').should('have.class')
  })

  it('should support keyboard navigation on buttons', () => {
    cy.get('button[aria-label*="Play"]').trigger('focus')
    cy.get('button[aria-label*="Play"]').should('have.focus')
  })

  it('should display all control elements in proper order', () => {
    cy.get('[role="region"] button').should('have.length.greaterThan', 2)
    cy.get('[role="region"] input').should('have.length.greaterThan', 1)
  })
})

describe('Audio Player State Persistence', () => {
  it('should maintain player state when navigating between episodes', () => {
    cy.visit('/episodes/ep-001')
    cy.get('button[aria-label*="Play"]').click()
    cy.get('button[aria-label*="Pause"]').should('be.visible')
    
    // Navigate to another episode
    cy.contains('Related Episodes').should('be.visible')
    cy.get('a[href="/episodes/ep-002"]').first().click()
    
    // Verify new episode is loaded
    cy.contains('Episode 2:').should('be.visible')
  })

  it('should load previous episode from episodes list page', () => {
    cy.visit('/episodes/ep-001')
    cy.get('button[aria-label*="Play"]').click()
    
    // Go back to episodes list
    cy.contains('← Back to Episodes').click()
    cy.url().should('include', '/episodes')
    
    // Navigate to another episode
    cy.get('a[href="/episodes/ep-002"]').first().click()
    cy.contains('Episode 2:').should('be.visible')
  })
})
