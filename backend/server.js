require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/dbConfig");

const app = express();

app.use(express.json());
app.use(cors());

connectDB();

app.get("/", (req, res) => {
  res.send("Backend");
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
