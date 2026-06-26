import 'dotenv/config';
import express from "express";
import cors from "cors";
import { clerkMiddleware } from '@clerk/express';
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import workspaceRouter from './routes/workspaceRoutes.js';
import { protect } from './middllewares/authMiddleware.js';
import projectRouter from './routes/projectRoutes.js';


const app = express();

app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());


app.get("/", (req, res)=>{
    res.status(200).send("Server live !");
});

app.use("/api/inngest", serve({ client: inngest, functions }));

// Routes

app.use("/api/workspaces", protect, workspaceRouter);

app.use("/api/projects", protect, projectRouter);

const port = 3000;

app.listen(port, ()=>{
    console.log(`sever listen to port ${port}`);
});
    // "test": "echo \"Error: no test specified\" && exit 1",
