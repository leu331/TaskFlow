import { create } from "domain";
import { Request, Response, NextFunction } from "express";
import { compare } from "bcrypt";
import {sign} from "jsonwebtoken"
import {z} from "zod"
import { authConfig } from "@/configs/authConfig";
import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";

export class SessionController {
    async create(request:Request, response: Response, next: NextFunction): Promise <void> {
        const bodySchema = z.object({
            email: z.string().email().trim(),
            password: z.string().min(3, "A senha precisa 8 caracteres")
        })

        const {email, password} = bodySchema.parse(request.body)

        const user = await prisma.user.findUnique({
            where: {email}
        })

        if (!user) {
           throw new AppError("Credenciais inválidas", 401) 
        }

        const passwordMatched = await compare(password, user.password)

        if (!passwordMatched) {
            throw new AppError("Credenciais inválidas", 401) 
        }

        const {secret, expiresIn} = authConfig.jwt

        const token = sign(
            {role: user.role ??  "customer"},
            secret,
            {
                subject: user.id ,
                expiresIn: "2h"
            }
        )

        response.status(200).json({Token: token, user})
    }
}