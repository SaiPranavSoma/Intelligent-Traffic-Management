const bcrypt = require("bcryptjs");

const plainPassword = "admin123"; // Change this to the password you want to hash
const saltRounds = 10;

bcrypt.hash(plainPassword, saltRounds, (err, hash) => {
  if (err) {
    console.error("Error hashing password:", err);
  } else {
    console.log("Hashed Password:", hash);
  }
});
