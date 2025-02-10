import { Router } from "express";
import { TeamController } from "@/controllers/teamController";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";

const teamRoutes = Router()
const teamController = new TeamController()

teamRoutes.post("/", ensureAuthenticated, verifyUserAuthorization(["admin"]),teamController.create)

export {teamRoutes}