import express from "express";
import { addMemeber, createProject, updateProject } from "../controllers/projectController.js";

const projectRouter = express.Router();

projectRouter.post("/", createProject);
projectRouter.put("/", updateProject);
projectRouter.post("/:projectId/addMemeber", addMemeber);

export default projectRouter;