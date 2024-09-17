import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './utils/db.js'; // Ensure the path is correct
import router from './routes/user.route.js';

dotenv.config(); // Load environment variables 
const app = express();

const PORT = process.env.PORT || 5000;


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: '*', // Allow request from all origins
    credentials: true, // Allow cookies to be sent
};

app.use(cors(corsOptions));

// Update the base route to match your Postman requests
app.use("/api/v1/users", router);

//apis
app.get("/api",(req,res)=>{
    res.send("Hello World");
});

// Start the server
app.listen(PORT, () => {
    connectDB(); // Connect to the database when the server starts
    console.log(`Server is running on port ${PORT}`);
});
