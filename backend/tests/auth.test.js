require("dotenv").config();
const request = require("supertest");
const mysql = require("mysql2");
const app = require("../server");

// ✅ Setup test database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "traffic_management",
});

beforeAll(async () => {
  // 🔹 Cleanup test user data before running tests
  await db.promise().query("DELETE FROM users WHERE email = 'testuser@example.com'");
  await db.promise().query("DELETE FROM vehicles WHERE vehicle_number = 'MH12AB1234'");
});

afterAll((done) => {
  db.end((err) => {
    if (err) return done(err);
    done();
  });
});

// ✅ Test User Registration
describe("POST /register", () => {
  it("should successfully register a new user", async () => {
    const res = await request(app).post("/register").send({
      name: "Test User",
      email: "testuser@example.com",
      phone: "0987654321",
      password: "password123",
      vehicle_count: 1,
      vehicles: ["MH12AB1234"],
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe("User and vehicles registered successfully"); // ✅ Updated message to match API response
  });
});

// ✅ Test User Login
describe("POST /login", () => {
  it("should return 401 for incorrect password", async () => {
    const res = await request(app).post("/login").send({
      email: "testuser@example.com",
      password: "wrongpassword",
      role: "public",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Incorrect password");
  });

  it("should return 401 for a non-existent user", async () => {
    const res = await request(app).post("/login").send({
      email: "doesnotexist@example.com",
      password: "randompassword",
      role: "public",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("User not found or incorrect role");
  });
});
