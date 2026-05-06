import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import { clerkMiddleware } from '@clerk/express';
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"



const app = express();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());


app.get("/", (req, res)=>{
    res.status(200).send("Test");
});

// app.use("/api/inngest", serve({ client: inngest, functions }));

const port = 3000;

app.listen(port, ()=>{
    console.log(`sever listen to port ${port}`);
});
    // "test": "echo \"Error: no test specified\" && exit 1",
