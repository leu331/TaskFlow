import { app } from "./App";
import { env } from "./env";

const PORT = 3333

app.listen(PORT, () => console.log(`O servidor está rodando na porta de número ${PORT}`))