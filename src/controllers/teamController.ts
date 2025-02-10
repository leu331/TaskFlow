import { prisma } from "@/database/prisma";
import { AppError } from "@/utils/AppError";
import { Request, Response, NextFunction } from "express";
import {z}  from 'zod'

export class TeamController {
    async create (request: Request, response: Response, next: NextFunction): Promise <void> {
        const bodySchema = z.object({
            name: z.string().trim(),
            description: z.string().trim().min(1, "Informe o que deve ser feito por seu time nesta tarefa.")
        })

        const user_id = request.user?.id

        const existingUser = await prisma.user.findUnique({
            where: {id: user_id},  
        })

        if(!existingUser) {
            throw new AppError("Usuário não encontrado", 409)
        }

        const { name, description} = bodySchema.parse(request.body)

        const team = await prisma.team.create({
            data: {
                name,
                description,  
            }
        })

        response.status(201).json({message: "Time criado com sucesso!", team})
    }
}