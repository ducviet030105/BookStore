import express from "express";
import "dotenv/config";
import cors from "cors";

import authRoutes from "./routes/AuthRoutes.js"
import bookRoutes from "./routes/BookRoutes.js"
import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json())
app.use(cors());

app.use('/api/auth', authRoutes)
app.use('/api/books', bookRoutes)

app.listen(PORT, "0.0.0.0" , () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB()
})