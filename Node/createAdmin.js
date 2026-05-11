require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("./config/db");

async function createAdmin() {
  const username = "admin";
  const password = "StrongPassword123";

  const hashedPassword = await bcrypt.hash(password, 12);

  await db.query(
    "INSERT INTO admin (username, password) VALUES ($1, $2)",
    [username, hashedPassword]
  );

  console.log("Admin created successfully");
  process.exit();
}

createAdmin();
