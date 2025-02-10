import { TeamMembersController } from "@/controllers/teamMemberController";
import { ensureAuthenticated } from "@/middlewares/ensureAuthenticated";
import { verifyUserAuthorization } from "@/middlewares/verifyUserAuthorization";
import { Router } from "express";

const teamMembersRoutes = Router()

const teamMemberControllerController = new TeamMembersController() 

teamMembersRoutes.post("/", ensureAuthenticated, verifyUserAuthorization(["admin"]), teamMemberControllerController.create)

export {teamMembersRoutes}