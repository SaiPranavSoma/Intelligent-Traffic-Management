const request = require("supertest");
const app = require("../server");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // Ensure bcrypt is imported
const db = require("../database");

jest.mock("bcrypt", () => ({
  hash: jest.fn((password, saltRounds, callback) => {
    callback(null, "$2b$10$mockedhashedpassword");
  }),
}));

describe("POST /reset-password", () => {
  const SECRET_KEY = "your_secret_key";
  const testToken = jwt.sign({ email: "testuser@example.com" }, SECRET_KEY);

  afterAll(() => {
    db.end(); // Close DB connection to avoid open handles
  });

  it("should reset password successfully", async () => {
    const res = await request(app).post("/reset-password").send({
      token: testToken,
      password: "newpassword123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Password successfully reset");
  });

  it("should return error for invalid token", async () => {
    const res = await request(app).post("/reset-password").send({
      token: "invalid_token",
      password: "newpassword123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Invalid token");
  });

  it("should return error for missing parameters", async () => {
    const res = await request(app).post("/reset-password").send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Token and new password are required");
  });
});
