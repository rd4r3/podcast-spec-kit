# Testing Guide for Podcast Website

## Unit Tests

### Running Unit Tests

```bash
# Run all unit tests
npm test

# Run specific test file
npm test -- src/__tests__/pages/index.test.tsx --no-coverage

# Run tests in watch mode
npm test:watch

# Run tests with coverage
npm test -- --coverage
```

### Current Unit Tests

**Home Page Tests** (`src/__tests__/pages/index.test.tsx`)
- 11 comprehensive tests covering:
  - Landing page rendering
  - Featured episode display
  - Recent episodes list
  - Navigation links
  - Error handling
  - Responsive layout

**Test Results**: ✅ 11 passed

### Test Framework

- **Framework**: Jest 29.7.0
- **UI Testing**: React Testing Library 14.0.0
- **Config**: `jest.config.js` and `jest.setup.js`

## E2E Tests

### Running E2E Tests

```bash
# Interactive mode (opens Cypress UI)
npm run test:e2e

# Headless mode (runs tests without UI)
npm run test:e2e:run

# Run specific test file
npm run test:e2e:run -- --spec cypress/e2e/home.cy.ts

# Run with specific browser
npm run test:e2e:run -- --browser chrome
npm run test:e2e:run -- --browser firefox
```

### Current E2E Tests

**Home Page Tests** (`cypress/e2e/home.cy.ts`)
- 17 test scenarios covering:
  - Page loading
  - Featured episode visibility
  - Navigation functionality
  - Responsive design (mobile, tablet, desktop)
  - Button interactions
  - Element visibility
  - User flows

### Test Framework

- **Framework**: Cypress 13.3.0
- **Config**: `cypress.config.ts`
- **Support Files**: `cypress/support/e2e.ts` and `cypress/support/commands.ts`

## Running Tests Locally

### Prerequisites

```bash
# Install dependencies
npm install

# Build the project
npm run build
```

### Full Test Suite

```bash
# 1. Run unit tests
npm test

# 2. Start development server (in separate terminal)
npm run dev

# 3. Run E2E tests (in another terminal)
npm run test:e2e:run
```

### Quick Verification

```bash
# Verify build
npm run build

# Run unit tests only
npm test -- --passWithNoTests
```

## Test Coverage

### Phase 3 Testing Coverage

**Landing Page (`src/pages/index.tsx`)**
- ✅ Component rendering
- ✅ Featured episode section
- ✅ Recent episodes grid
- ✅ Navigation links
- ✅ Responsive design
- ✅ User interactions

**Coverage Metrics**
- Unit Tests: 11/11 passing
- E2E Test Scenarios: 17 covering critical user flows
- Build Status: ✅ 26 pages, 0 errors

## Continuous Integration

These tests can be integrated into CI/CD pipelines:

```bash
# For GitHub Actions or similar CI tools
npm run build && npm test -- --passWithNoTests
```

## Troubleshooting

### Unit Tests Won't Run
- Ensure Jest dependencies are installed: `npm install`
- Check that `jest.config.js` and `jest.setup.js` exist
- Clear Jest cache: `npm test -- --clearCache`

### E2E Tests Won't Connect
- Ensure development server is running: `npm run dev`
- Check that baseUrl in `cypress.config.ts` is correct
- Increase timeout if network is slow: modify `defaultCommandTimeout` in config

### Tests Fail After Code Changes
- Ensure tests match your implementation
- Update test mocks if data structures change
- Re-run tests after dependency updates

## Best Practices

1. **Run tests before committing**
   ```bash
   npm test && npm run build
   ```

2. **Use watch mode for development**
   ```bash
   npm test:watch
   ```

3. **Keep E2E tests focused on critical paths**
   - Test user-visible functionality
   - Don't test implementation details

4. **Update tests when requirements change**
   - Sync tests with feature updates
   - Maintain test readability

## Future Testing Enhancements

- Add tests for Phase 4+ user stories
- Implement visual regression testing
- Add performance benchmarking
- Create test data factories
- Setup code coverage reporting
- Add accessibility testing with axe-core

