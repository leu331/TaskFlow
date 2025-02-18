import { Request, Response, NextFunction } from "express";
import { AppError } from "@/utils/AppError";

function verifyUserAuthorization(role: string[]) {
    return (request: Request, response: Response, next: NextFunction) => {
        if (!request.user) {
            throw new AppError("Usuário não autenticado", 401)
        }

        if (!request.user.role) {
            throw new AppError ("Papel do usuário não encontrado.")
        }

        if (!role.includes(request.user?.role)) {
            throw new AppError(`Acesso negado. o papel ${request.user.role} não tem permissão para acessar essa rota.`, 401)  
        }

        if (!role.includes(request.user.role)) {
            throw new AppError("Não autorizado", 403)
        }

        return next()
    }
}

export {verifyUserAuthorization}