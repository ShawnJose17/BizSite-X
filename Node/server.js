const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running.");
});

app.post("/contact", (req, res) => {
  console.log("Incoming data:", req.body);
  res.json({ message: "Form received successfully" });
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
