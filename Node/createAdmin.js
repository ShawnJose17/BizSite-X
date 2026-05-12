require("dotenv").config();
const bcrypt = require("bcryptjs");
const db = require("./config/db");

async function updateAdmin() {
  const username = "admin";
  const password = "admin123";

  const hashedPassword = await bcrypt.hash(password, 12);

  await db.query(
    "UPDATE admin SET password = $1 WHERE username = $2",
    [hashedPassword, username]
  );

  console.log("Password updated");
  process.exit();
}

updateAdmin();
