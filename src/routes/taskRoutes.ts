import { Router } from "express";
import { TaskController } from "@/controllers/taskController";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";

const taskRoutes = Router()
const taskController = new TaskController()

taskRoutes.post("/", taskController.create)
taskRoutes.get("/", ensureAuthenticated, verifyUserAuthorization(["admin"]), taskController.index)
taskRoutes.get("/", ensureAuthenticated, verifyUserAuthorization(["admin", "teamLeader"]),  taskController.show)
taskRoutes.put("/", ensureAuthenticated, verifyUserAuthorization(["admin", "teamLeader"]),  taskController.update)
taskRoutes.delete("/", ensureAuthenticated, verifyUserAuthorization(["admin", "teamLeader"]),  taskController.delete)

export {taskRoutes}