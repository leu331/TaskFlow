import { Request, Response, NextFunction } from "express";
import {z} from "zod"
import {prisma} from "../database/prisma"
import { AppError } from "@/utils/AppError";
import { log } from "console";

export class TeamMembersController {
    async create(request:Request, response: Response, next: NextFunction): Promise<void> {
        const bodySchema = z.object({
            team_id: z.string().uuid(),
            user_id: z.string().uuid(),
        })

        const {team_id, user_id} = bodySchema.parse(request.body)

       

        const team = await prisma.team.findUnique({where: {id: team_id}})

        if (!team) {
            throw new AppError("Time não encontrado", 404)
        };
        
        const id = request.user?.id

        const existingUser = await prisma.user.findUnique({
            where: {id}
        })

        if (!existingUser) {
            throw new AppError("Este usuário não existe")
        }

        const userToAdd = await prisma.user.findUnique({ 
            where: { id: user_id },
            // include: {
            //     user: true
            // } 
        });

        if (!userToAdd) throw new AppError("Usuário não encontrado", 404);

        const alreadyMember = await prisma.teamMember.findFirst({
            where: { teamId: team_id, userId: user_id }
        });
        
        if (alreadyMember) throw new AppError("Usuário já faz parte do time", 400);

        const newMember = await prisma.teamMember.create({
            data : {  
                teamId: team_id,
                userId: user_id
            },
            include: {
                user: {select: {name: true}}
            }      
        })

        response.status(201).json({Mensagem: "Adicionado com sucesso"})
    } 

}