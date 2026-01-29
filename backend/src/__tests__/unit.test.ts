import bcryptjs from "bcryptjs";

describe("Unit Tests - Password & Data Validation", () => {
  // Setup - run once before all unit tests
  beforeAll(() => {
    console.log("🟢 Starting unit tests");
  });

  // Run before each test to ensure clean state
  beforeEach(() => {
    console.log("  ▶ Running test...");
  });

  // Run after each test to verify cleanup
  afterEach(() => {
    console.log("  ✓ Test completed");
  });

  // Cleanup - run once after all unit tests
  afterAll(() => {
    console.log("🔴 All unit tests finished\n");
  });

  describe("Password Hashing", () => {
    test("should hash password correctly", async () => {
      const password = "testPassword123";
      const hashedPassword = await bcryptjs.hash(password, 10);

      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(0);
    });

    test("should compare password with hash correctly", async () => {
      const password = "testPassword123";
      const hashedPassword = await bcryptjs.hash(password, 10);

      const isMatch = await bcryptjs.compare(password, hashedPassword);
      expect(isMatch).toBe(true);
    });

    test("should not match wrong password", async () => {
      const password = "testPassword123";
      const wrongPassword = "wrongPassword";
      const hashedPassword = await bcryptjs.hash(password, 10);

      const isMatch = await bcryptjs.compare(wrongPassword, hashedPassword);
      expect(isMatch).toBe(false);
    });
  });

  describe("Data Validation", () => {
    test("email should be valid format", () => {
      const validEmail = "test@example.com";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(validEmail)).toBe(true);
    });

    test("email should reject invalid format", () => {
      const invalidEmail = "notanemail";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      expect(emailRegex.test(invalidEmail)).toBe(false);
    });

    test("password should have minimum length", () => {
      const password = "short";
      expect(password.length >= 6).toBe(false);
    });

    test("password should validate minimum length", () => {
      const password = "validPassword123";
      expect(password.length >= 6).toBe(true);
    });
  });

  describe("Task Status Validation", () => {
    test("task status should be valid enum value", () => {
      const validStatuses = ["pending", "completed", "deleted"];
      const taskStatus = "pending";

      expect(validStatuses.includes(taskStatus)).toBe(true);
    });

    test("task status should reject invalid value", () => {
      const validStatuses = ["pending", "completed", "deleted"];
      const taskStatus = "invalid";

      expect(validStatuses.includes(taskStatus)).toBe(false);
    });
  });

  describe("Priority Validation", () => {
    test("priority should be valid enum value", () => {
      const validPriorities = ["low", "medium", "high"];
      const taskPriority = "high";

      expect(validPriorities.includes(taskPriority)).toBe(true);
    });

    test("priority should reject invalid value", () => {
      const validPriorities = ["low", "medium", "high"];
      const taskPriority = "urgent";

      expect(validPriorities.includes(taskPriority)).toBe(false);
    });
  });
});
