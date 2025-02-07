import { app } from "./App";
import { env } from "./env";

const PORT = 3333

app.listen(() => console.log(`O servirdor está rodando na porta de número ${PORT}`))