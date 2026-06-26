import express from "express";
import { addMember, getUserWorkSpaces } from "../controllers/workSpaceController.js";

const workspaceRouter = express.Router();

workspaceRouter.get("/", getUserWorkSpaces);
workspaceRouter.post("/addMember", addMember);

export default workspaceRouter;