import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRoute from './src/routes/user.routes.js';
import blogRoute from './src/routes/blog.routes.js';
import { DB_NAME } from './src/constants.js';


// Initialize the app
const app = express();

app.use('/uploads', express.static('uploads'));

app.use(cors({
    origin: [ 'http://localhost:5173', 'https://megablogapp-p0ys.onrender.com' ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(cookieParser());

// Middleware to parse JSON requests
app.use(express.json());

// MongoDB connection
;(async() => {
    try {
        await mongoose.connect(`${process.env.MONGO_ATLAS_URI}/${DB_NAME}`);
        console.log('Connected to MongoDB Atlas');
        app.on("error", (err) =>{
            console.log("MongoDB connection error: ", err.message)
            throw err;
        });
    } catch (error) {
        console.log("Error in mongodb connection: ", error.message);
        throw error;
    }
})();

// Basic route
app.use('/api/user', userRoute);
app.use('/api/blog', blogRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});

