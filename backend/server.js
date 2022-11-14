import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import moodRoutes from "./routes/moodRoutes.js";

// import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
const app = express();
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/mood", moodRoutes);
// app.use(notFound);
// app.use(errorHandler);

dotenv.config();

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`server running on ${PORT}`));
