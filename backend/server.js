require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require("path");
const fs = require("fs");



const app = express();
const PORT = process.env.PORT || 5001;
const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key";
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "traffic_management",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err.sqlMessage);
    process.exit(1);
  } else {
    console.log("✅ Connected to MySQL Database");
  }
});

// ✅ Secure email transporter using environment variables
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ✅ Register a New Public User
app.post("/register", async (req, res) => {
  const { name, email, phone, password, vehicle_count, vehicles } = req.body;
  const role = "public";

  if (!name || !email || !phone || !password || vehicle_count === undefined) {
    return res.status(400).json({ message: "All fields are required" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (result.length > 0) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.query(
      "INSERT INTO users (name, email, phone, password, role, vehicle_count) VALUES (?, ?, ?, ?, ?, ?)", 
      [name, email, phone, hashedPassword, role, vehicle_count], 
      (err, userResult) => {
        if (err) return res.status(500).json({ message: "Registration failed" });

        const userId = userResult.insertId;
        
        // Insert vehicle numbers
        if (vehicles && vehicles.length > 0) {
          const vehicleValues = vehicles.map(vehicle => [userId, vehicle]);
          db.query("INSERT INTO vehicles (user_id, vehicle_number) VALUES ?", [vehicleValues], (err) => {
            if (err) return res.status(500).json({ message: "Error saving vehicle details" });
          });
        }

        res.status(201).json({ message: "User and vehicles registered successfully" });
      }
    );
  });
});

// ✅ Login for Users
app.post("/login", (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  db.query("SELECT * FROM users WHERE email = ? AND role = ?", [email, role], async (err, results) => {
    if (err) return res.status(500).json({ message: "Server error" });
    if (results.length === 0) return res.status(401).json({ message: "User not found or incorrect role" });

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).json({ message: "Incorrect password" });

    // Generate JWT token
    const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });

    // Update last_login timestamp
    db.query("UPDATE users SET last_login = NOW() WHERE id = ?", [user.id], (updateErr) => {
      if (updateErr) return res.status(500).json({ message: "Error updating last login timestamp" });

      res.json({ message: "Login successful", role: user.role, token });
    });
  });
});



app.post("/add-police", async (req, res) => {
  const { name, email, phone, location, password } = req.body;

  if (!name || !email || !phone || !location || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Using db.query() instead of db.execute()
    db.query(
      "INSERT INTO users (name, email, phone, location, password, role) VALUES (?, ?, ?, ?, ?, 'police')",
      [name, email, phone, location, hashedPassword],
      (error, results) => {
        if (error) {
          console.error("Database error:", error);
          return res.status(500).json({ error: "Database error: " + error.message });
        }
        res.json({ message: "Police officer added successfully!" });
      }
    );
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Server error: " + error.message });
  }
});



app.post("/forgot-password", (req, res) => {
  const { email } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error" });

    if (result.length === 0) {
      return res.status(400).json({ message: "Email not found" });
    }

    // Generate reset token (NO EXPIRATION)
    const token = jwt.sign({ email }, SECRET_KEY);

    // Send email with the reset link
    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("❌ Error sending email:", error);
        return res.status(500).json({ message: "Error sending email" });
      }
      console.log("✅ Reset email sent:", info.response);
      res.json({ message: "Reset email sent! Check your inbox." });
    });
  });
});





app.post("/reset-password", (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ message: "Token and new password are required" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(400).json({ message: "Invalid token" });

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return res.status(500).json({ message: "Error hashing password" });

      db.query("UPDATE users SET password = ? WHERE email = ?", [hash, decoded.email], (err) => {
        if (err) return res.status(500).json({ message: "Database error" });

        res.json({ message: "Password successfully reset" });
      });
    });
  });
});



// ✅ Create `uploads` folder if not exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store in `uploads/` folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// ✅ Report Incident
app.post("/report-incident", upload.single("image"), (req, res) => {
  const { email, description, location } = req.body;

  if (!req.file || !email || !description || !location) {
    return res.status(400).json({ message: "All fields (email, description, image, location) are required!" });
  }

  const documentPath = `/uploads/${req.file.filename}`;

  // Check if the user exists in the users table
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) {
      console.error("❌ Database error:", err.sqlMessage);
      return res.status(500).json({ message: "Database error", error: err.sqlMessage });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Email not registered. Please sign up first." });
    }

    // ✅ Update the user's record with location, description, and document path
    db.query(
      "UPDATE users SET location = ?, description = ?, document_path = ? WHERE email = ?",
      [location, description, documentPath, email],
      (err, updateResult) => {
        if (err) {
          console.error("❌ Database error:", err.sqlMessage);
          return res.status(500).json({ message: "Failed to update user report", error: err.sqlMessage });
        }
        console.log("✅ Incident reported successfully:", updateResult);
        res.json({ message: "Incident reported successfully!", documentPath });
      }
    );
  });
});





app.post("/api/file-challan", (req, res) => {
  const { vehicle_number, reason, fine } = req.body;

  if (!vehicle_number || !reason || !fine) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const fetchUserQuery = "SELECT user_id FROM vehicles WHERE vehicle_number = ?";
  db.query(fetchUserQuery, [vehicle_number], (err, result) => {
    if (err) {
      console.error("❌ Database error:", err);
      return res.status(500).json({ message: "Database error while fetching user_id" });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "Vehicle number not found" });
    }

    const userId = result[0].user_id; // Get user_id from the query result

    const insertChallanQuery =
      "INSERT INTO challans (user_id, vehicle_number, reason, fine) VALUES (?, ?, ?, ?)";
    
    db.query(insertChallanQuery, [userId, vehicle_number, reason, fine], (err) => {
      if (err) {
        console.error("❌ Error inserting challan:", err);
        return res.status(500).json({ message: "Failed to file challan" });
      }
      res.json({ message: "✅ Challan issued successfully!" });
    });
  });
});


// ✅ View Challans for a Vehicle
app.get("/api/view-challan/:vehicle_number", (req, res) => {
  const { vehicle_number } = req.params;

  // Check if the vehicle exists
  const checkVehicleQuery = "SELECT * FROM vehicles WHERE vehicle_number = ?";
  db.query(checkVehicleQuery, [vehicle_number], (err, vehicleResults) => {
    if (err) {
      console.error("❌ Database error:", err);
      return res.status(500).json({ message: "Database error" });
    }

    if (vehicleResults.length === 0) {
      return res.status(404).json({ message: "No details found for this vehicle" });
    }

    // Fetch user details (License removed, keeping Email)
    const userQuery = `
      SELECT u.id, u.name, u.email, u.phone 
      FROM users u 
      JOIN vehicles v ON u.id = v.user_id 
      WHERE v.vehicle_number = ?
    `;

    db.query(userQuery, [vehicle_number], (err, userResults) => {
      if (err) {
        console.error("❌ Database error:", err);
        return res.status(500).json({ message: "Database error while fetching user details" });
      }

      if (userResults.length === 0) {
        return res.status(404).json({ message: "No user found for this vehicle" });
      }

      const userDetails = userResults[0];

      // Fetch challan details
      const challanQuery = `
        SELECT reason, fine, payment_status, 
        DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:%s') AS created_at
        FROM challans 
        WHERE vehicle_number = ?
      `;

      db.query(challanQuery, [vehicle_number], (err, challanResults) => {
        if (err) {
          console.error("❌ Database error:", err);
          return res.status(500).json({ message: "Database error while fetching challans" });
        }

        res.json({ 
          user: userDetails, 
          challans: challanResults.length > 0 ? challanResults : [] 
        });
      });
    });
  });
});


app.get("/api/view-fines", async (req, res) => {
  const { email } = req.query; // ✅ Get email from frontend request

  if (!email) {
      return res.status(400).json({ error: "Email is required" });
  }

  try {
      // 🔍 Step 1: Find the user ID using the email
      const userQuery = "SELECT id FROM users WHERE email = ?";
      db.query(userQuery, [email], (err, result) => {
          if (err || result.length === 0) {
              return res.status(404).json({ error: "User not found" });
          }

          const userId = result[0].id;

          // 🔍 Step 2: Get fines including the payment status
          const finesQuery = "SELECT challan_id, vehicle_number, reason, fine, timestamp, payment_status FROM challans WHERE user_id = ?";
          db.query(finesQuery, [userId], (err, fines) => {
              if (err) {
                  return res.status(500).json({ error: "Error fetching fines" });
              }

              res.json(fines);
          });
      });
  } catch (error) {
      res.status(500).json({ error: "Server error" });
  }
});


app.post("/api/update-payment", async (req, res) => {
  const { challan_id } = req.body;

  if (!challan_id) {
      return res.status(400).json({ error: "Challan ID is required" });
  }

  try {
      const query = "UPDATE challans SET payment_status = 'completed' WHERE challan_id = ?";
      db.query(query, [challan_id], (err, result) => {
          if (err) {
              return res.status(500).json({ error: "Failed to update payment status" });
          }
          res.json({ message: "Payment successful!" });
      });
  } catch (error) {
      res.status(500).json({ error: "Server error" });
  }
});


// ✅ Get Police Location
app.get("/get-police-location", (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  db.query("SELECT location FROM users WHERE email = ?", [email], (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Database error", error: err.sqlMessage });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: "No user found with this email" });
    }
    res.json({ location: result[0].location });
  });
});


app.get("/get-reports", (req, res) => {
  const { location } = req.query;

  if (!location) {
    return res.status(400).json({ message: "❌ Location is required" });
  }

  const query = "SELECT id, email, location, description, document_path, progress FROM users WHERE location = ? AND role = 'public' AND description IS NOT NULL";

  db.query(query, [location], (err, result) => {
    if (err) {
      console.error("❌ Database error:", err.sqlMessage);
      return res.status(500).json({ message: "Database error", error: err.sqlMessage });
    }

    console.log("✅ Reports fetched:", result); // LOG RESULT TO CHECK

    res.json(result);
  });
});


app.put("/update-report/:email", (req, res) => {
  const { email } = req.params;
  const { progress } = req.body;

  console.log(`📩 Update request for email: ${email}, new progress: ${progress}`); // Debug log

  if (!progress) {
    return res.status(400).json({ message: "Progress value is required." });
  }

  const checkQuery = "SELECT * FROM users WHERE email = ?";
  db.query(checkQuery, [email], (err, result) => {
    if (err) {
      console.error("❌ Database Error:", err);
      return res.status(500).json({ message: "Database error", error: err.sqlMessage });
    }

    if (result.length === 0) {
      console.warn("⚠️ No report found for email:", email);
      return res.status(404).json({ message: "Report not found." });
    }

    const updateQuery = "UPDATE users SET progress = ? WHERE email = ?";
    db.query(updateQuery, [progress, email], (updateErr) => {
      if (updateErr) {
        console.error("❌ Update Error:", updateErr);
        return res.status(500).json({ message: "Database error", error: updateErr.sqlMessage });
      }
      console.log("✅ Progress updated successfully for:", email);
      res.json({ message: "Progress updated successfully!" });
    });
  });
});


app.get("/get-user-reports", (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  const query = "SELECT * FROM users WHERE email = ? AND description IS NOT NULL";
  db.query(query, [email], (err, result) => {
    if (err) {
      console.error("❌ Database error:", err.sqlMessage);
      return res.status(500).json({ message: "Database error", error: err.sqlMessage });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "No reports found." });
    }

    res.json(result);
  });
});



app.get("/get-reports-admin", (req, res) => {
  const query = "SELECT * FROM users WHERE description IS NOT NULL";
  db.query(query, (err, result) => {
    if (err) {
      console.error("❌ Database error:", err.sqlMessage);
      return res.status(500).json({ message: "Database error", error: err.sqlMessage });
    }

    console.log("✅ Reports Fetched:", result);

    if (result.length === 0) {
      return res.status(404).json({ message: "No reports found." });
    }

    res.json(result);
  });
});





app.get("/api/user-locations", (req, res) => {
  const query = "SELECT location, COUNT(*) AS count FROM users GROUP BY location";

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error", details: err });
    }
    res.json(result);
  });
});



app.get("/api/user-progress", (req, res) => {
  const query = "SELECT progress, COUNT(*) AS count FROM users GROUP BY progress";
  db.query(query, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }
    console.log("Progress Data:", result); // Debugging
    res.json(result);
  });
});


// Endpoint to get recent logins
app.get("/api/recent-logins", (req, res) => {
  const { role } = req.query;

  let sql = "SELECT id, email, last_login FROM users WHERE last_login IS NOT NULL";
  
  if (role) {
    sql += " AND role = ?";
  }

  sql += " ORDER BY last_login DESC LIMIT 10";

  db.query(sql, role ? [role] : [], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(results);
  });
});


app.get("/api/challan-status", (req, res) => {
  const query = "SELECT payment_status, SUM(fine) AS amount FROM challans GROUP BY payment_status";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error", details: err });
    }
    res.json(result);
  });
});

// Get user details by email
app.get("/api/user/:email", (req, res) => {
  const { email } = req.params;
  const query = "SELECT name, email, phone FROM users WHERE email = ?";
  db.query(query, [email], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ error: "User not found" });
    res.json(result[0]);
  });
});

// Update user details
app.put("/api/user/update", async (req, res) => {
  const { email, name, phone, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  let updateQuery = "UPDATE users SET ";
  let updateValues = [];

  if (name) {
    updateQuery += "name = ?, ";
    updateValues.push(name);
  }
  if (phone) {
    updateQuery += "phone = ?, ";
    updateValues.push(phone);
  }
  if (password) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10); // ✅ Hash password
      updateQuery += "password = ?, ";
      updateValues.push(hashedPassword);
    } catch (err) {
      return res.status(500).json({ error: "Error hashing password." });
    }
  }

  updateQuery = updateQuery.slice(0, -2) + " WHERE email = ?";
  updateValues.push(email);

  db.query(updateQuery, updateValues, (err, result) => {
    if (err) {
      console.error("Update error:", err);
      return res.status(500).json({ error: "Failed to update profile" });
    }
    res.json({ message: "Profile updated successfully" });
  });
});




// ✅ Export the app instead of calling app.listen()
module.exports = app;



// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
