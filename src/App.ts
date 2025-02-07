import express, {ErrorRequestHandler} from "express"
import "express-async-error"
import { errorHandling } from "./middlewares/errorHandling"

const app = express()

app.use(express.json())

app.use(errorHandling)

export {app}