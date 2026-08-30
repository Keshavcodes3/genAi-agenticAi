import express from "express";
import { IdentifyUser } from "../Middlewares/auth.middleware.js";
import {
    addConversationToProject,
    createProject,
    deleteProject,
    renameProject,
    viewAllProjects,
    viewOneProject,
} from "../Controllers/project.controller.js";

const projectRoutes = express.Router();

projectRoutes.post("/", IdentifyUser, createProject);
projectRoutes.get("/", IdentifyUser, viewAllProjects);
projectRoutes.get("/:projectId", IdentifyUser, viewOneProject);
projectRoutes.post("/add/:projectId", IdentifyUser, addConversationToProject);
projectRoutes.delete("/:projectId", IdentifyUser, deleteProject);
projectRoutes.patch("/rename/:projectId",IdentifyUser,renameProject)


export default projectRoutes;
