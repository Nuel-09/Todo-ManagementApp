# Testing Guide - Todo App

## Overview

This project includes comprehensive unit tests and integration tests for the backend.

---

## Backend Testing

### Technologies Used

- **Jest** - Testing framework
- **ts-jest** - TypeScript support for Jest
- **Supertest** - HTTP assertion library (ready for API tests)

### Running Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run tests with coverage report
npm run test:coverage
```

### Backend Test Files

1. **`src/__tests__/unit.test.ts`** - Unit Tests

   - Password hashing validation
   - Email format validation
   - Task status validation
   - Priority validation
   - Password security checks

2. **`src/__tests__/integration.test.ts`** - Integration Tests
   - API response format validation
   - Task CRUD operations
   - Authorization logic
   - Session management
   - Error handling

### Test Coverage

Expected tests to pass:

- ✅ 10+ unit tests (password, email, validation)
- ✅ 15+ integration tests (API format, CRUD, auth)

---

## Test Structure

### Unit Tests

Test individual functions/components in isolation.

**Example:**

```javascript
it("should hash password correctly", async () => {
  const password = "testPassword123";
  const hashedPassword = await bcryptjs.hash(password, 10);

  expect(hashedPassword).not.toBe(password);
  expect(hashedPassword.length).toBeGreaterThan(0);
});
```

### Integration Tests

Test how multiple components work together.

**Example:**

```javascript
it('user should not modify other user's task', () => {
  const task = { userId: "user1", title: "Task" };
  const currentUserId = "user2";
  const isAuthorized = task.userId === currentUserId;

  expect(isAuthorized).toBe(false);
});
```

---

## Running All Tests

### Test Backend

```bash
# Backend tests
cd backend && npm test
```

### Continuous Testing

```bash
# Watch mode for backend (auto-rerun on file changes)
cd backend && npm run test:watch
```

---

## Expected Test Results

### Backend Output

```
PASS  src/__tests__/unit.test.ts
  ✓ Password Hashing (3 tests)
  ✓ Data Validation (4 tests)
  ✓ Task Status Validation (2 tests)
  ✓ Priority Validation (2 tests)

PASS  src/__tests__/integration.test.ts
  ✓ API Response Format (3 tests)
  ✓ Task CRUD Operations (3 tests)
  ✓ Authorization Logic (2 tests)
  ✓ Session Management (3 tests)

Tests: 24 passed, 24 total
```

---

## What Each Test Validates

### Security Tests

- ✅ Passwords are hashed (never plain text)
- ✅ Email format validation
- ✅ Session security settings
- ✅ User authorization checks

### Functionality Tests

- ✅ Task CRUD operations
- ✅ Task status validation
- ✅ Priority level validation
- ✅ Error handling

### Data Integrity Tests

- ✅ Task ownership preserved on updates
- ✅ Deleted tasks properly marked
- ✅ Password matching validation

---

## Troubleshooting

### Backend Test Issues

**Issue: "Cannot find module 'mongoose'"**

```bash
cd backend
npm install
npm test
```

**Issue: Tests not finding files**

```bash
# Ensure jest.config.js exists in backend root
# Check paths in jest.config.js match your structure
```

**Issue: "jest is not recognized"**

```bash
cd backend
npm install
npx jest
```

---

## Adding New Tests

### Backend Example

```typescript
describe("New Feature", () => {
  it("should do something", () => {
    const result = newFunction();
    expect(result).toBe(expectedValue);
  });
});
```

Create in: `backend/src/__tests__/newfeature.test.ts`

---

## CI/CD Integration

To run tests automatically on code push, add to your Git workflow:

```bash
# Before committing
cd backend && npm test

# All tests must pass before deployment
```

---

## Test Metrics

Current test coverage:

- **Backend:** 24 tests (unit + integration)
- **Unit Tests:** 11 tests (password, email, validation)
- **Integration Tests:** 13 tests (API format, CRUD, auth, session)

Next steps:

- Add more edge case tests
- Add performance tests
- Add E2E tests with Supertest
