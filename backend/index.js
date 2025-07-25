import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/auhtRoutes.js"
import taskRoutes from './src/routes/taskRoutes.js';
dotenv.config();

const app=express();
app.use(express.json());
app.use(cors());
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true 
}));

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(process.env.PORT,()=>{
    console.log("Server is running");
    connectDB();
});









