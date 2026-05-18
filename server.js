import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb+srv://dbfremorglobal:Test%401234@cluster0.gidgn8l.mongodb.net/?appName=Cluster0")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Test route
app.get("/", (req, res) => {
  res.send("API Running");
});

// Server start
app.listen(5000, () => {
  console.log("Server running on port 5000");
});