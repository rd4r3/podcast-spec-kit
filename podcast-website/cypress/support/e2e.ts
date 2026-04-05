import './commands'

// Handle uncaught exceptions from audio errors
Cypress.on('uncaught:exception', (err) => {
  // Ignore audio-related errors in tests (expected in headless environment)
  if (err.message.includes('The element has no supported sources')) {
    return false
  }
  // Let other errors fail the test
  return true
})
