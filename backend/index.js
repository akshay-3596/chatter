import express from "express";
import dotenv from 'dotenv'
import authRoutes from "./src/routes/auth.route.js";
import { connectDB } from "./src/lib/db.js";
import cookieParser from "cookie-parser";

app.use(cookieParser());

const app = express()

dotenv.config()

app.use(express.json())

app.use("/api/auth", authRoutes);
const port = process.env.PORT;

app.listen(port, ()=>{
    console.log(`server is running at http://localhost:${port}`);
    connectDB();
});