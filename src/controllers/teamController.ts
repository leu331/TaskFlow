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

    async update (request: Request, response: Response, next: NextFunction): Promise <void>{
        const paramsSchema = z.object({
            id: z.string().uuid()
        })

        const bodySchema = z.object({
            status: z.string().trim().refine(value => ['open', 'closed'].includes(value), {message: "O valor do campo 'status' e inválido, os valores possíveis são 'open' ou 'closed'"})
        })

        const paramsResult = paramsSchema.parse(request.params)

        if (!paramsResult) {
            response.status(400).json({ erro: paramsResult });
            return;
        }

        const bodyResult = bodySchema.parse(request.body);
        if (!bodyResult) {
           response.status(400).json({ error: bodyResult });
           return
        }

        const {id} = request.params
        const {status} = request.body

        const existingTeam = await prisma.team.findUnique({ where: { id } });

        if (!existingTeam) {
            response.status(404).json({ erro: "Time não encontrado." });
            return
        }

        if (existingTeam.status === "closed") {
            response.status(400).json({ erro: "Este time já foi fechado e não pode mais ser atualizado." });
            return
        }

        const updatedTeam = await prisma.team.update({
            where: {id}, data: {status, updatedAt: new Date}
        })

        response.status(200).json({mensagem: "Time atualizado com sucesso", updatedTeam})
        return
    }

    async index(request: Request, response: Response, next: NextFunction): Promise<void> {
        const { name } = request.query;
        const {status} = request.query
        const {id} = request.query

        const filter: any = {};

        if (name) {
            filter.name = {
                contains: String(name),
                mode: "insensitive",
            };
        }

        if(status) {
            filter.status = {
                equals: String(status),
            }
        }
        if (id) {
            filter.id = {
                contains: String(id),
                mode: "insensitive",
            }
        }

        try {
            const teams = await prisma.team.findMany({
                where: filter,

                include: {
                    TeamMember: {
                        select: {
                            user: {
                                select: {
                                    id: true,
                                    name: true,
                                    email: true,
                                    role: true
                                }
                            }
                        }
                    }
                          
                }
            });

            response.status(200).json({ Times: teams });
        } catch (error) {
            next(new AppError("Erro ao buscar times.", 500)); 
        }
    }
}
