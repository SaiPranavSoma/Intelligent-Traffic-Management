const request = require("supertest");
const app = require("../server");
const db = require("../database");

describe("POST /api/file-challan", () => {
  let testUserId;
  const validVehicleNumber = "MH12AB1234";

  beforeAll(async () => {
    try {
      console.log("🚀 Setting up test database...");

      await db.promise().beginTransaction();

      // ✅ Delete existing test user to avoid duplicate entry issues
      await db.promise().query("DELETE FROM users WHERE email = ?", ["testuser@example.com"]);

      // ✅ Insert test user (Avoid duplicate errors)
      await db.promise().query(
        "INSERT IGNORE INTO users (name, email, password) VALUES (?, ?, ?)",
        ["Test User", "testuser@example.com", "password123"]
      );

      // ✅ Fetch test user ID
      const [userRow] = await db.promise().query("SELECT id FROM users WHERE email = ?", ["testuser@example.com"]);
      testUserId = userRow.length > 0 ? userRow[0].id : null;

      if (!testUserId) {
        throw new Error("❌ Failed to retrieve test user ID");
      }

      console.log("✅ Test user ID:", testUserId);

      // ✅ Ensure test vehicle exists
      await db.promise().query(
        "INSERT IGNORE INTO vehicles (vehicle_number, user_id) VALUES (?, ?)",
        [validVehicleNumber, testUserId]
      );
      console.log("✅ Test vehicle created:", validVehicleNumber);

      await db.promise().commit();
    } catch (err) {
      await db.promise().rollback();
      console.error("❌ Setup Error:", err);
    }
  });

  afterAll(async () => {
    try {
      console.log("🧹 Cleaning up test data...");

      await db.promise().query("DELETE FROM challans WHERE vehicle_number = ?", [validVehicleNumber]);
      await db.promise().query("DELETE FROM vehicles WHERE vehicle_number = ?", [validVehicleNumber]);
      await db.promise().query("DELETE FROM users WHERE email = ?", ["testuser@example.com"]);

      console.log("✅ Test data cleaned up.");
    } catch (err) {
      console.error("❌ Cleanup Error:", err);
    } finally {
      await db.end(); // ✅ Ensure database connection is closed
    }
  });

  it("should return 400 if fields are missing", async () => {
    const res = await request(app).post("/api/file-challan").send({
      vehicle_number: validVehicleNumber,
      reason: "Speeding",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("All fields are required");
  });

  it("should return 404 if vehicle number is not found", async () => {
    const res = await request(app).post("/api/file-challan").send({
      vehicle_number: "MH00XX0000",
      reason: "Wrong Parking",
      fine: 300,
    });

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Vehicle number not found");
  });
});
