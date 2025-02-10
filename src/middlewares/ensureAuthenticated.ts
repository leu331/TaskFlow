import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { authConfig } from "@/configs/authConfig";
import { AppError } from "@/utils/AppError";

interface TokenPayload {
    role: string,
    sub: string
}

function ensureAuthenticated (request: Request, response: Response, next: NextFunction) {
    const authHeader = request.headers.authorization

    if(!authHeader) {
        return next (new AppError("Token de acesso não encontrado", 401))
    }

    try {
        const [, token] = authHeader.split(" ")
        const {role, sub: user_id} = verify(token, authConfig.jwt.secret) as TokenPayload

        request.user = { id: user_id, role}
        return next()
    } 
    
    catch (error) {
        return next(new AppError("Token inválido", 401));
    }
}

export {ensureAuthenticated}