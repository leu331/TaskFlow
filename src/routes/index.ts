import { Router } from "express";
import { userRoutes } from "./userRoutes";
import { sessionRoutes } from "./sessionRoutes";
import { teamRoutes } from "./teamRoutes";
import {teamMembersRoutes} from "./teamMembersRoutes"
import { taskRoutes } from "./taskRoutes";

const routes = Router()
routes.use("/user", userRoutes)
routes.use("/session", sessionRoutes)
routes.use("/team", teamRoutes)
routes.use("/team/members", teamMembersRoutes)
routes.use("/task", taskRoutes)

export {routes}