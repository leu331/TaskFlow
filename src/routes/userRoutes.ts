import { UserController } from "@/controllers/userController";
import { Router } from "express";

const userRoutes = Router()

const userController = new UserController 

userRoutes.post("/", userController.create)

export {userRoutes}