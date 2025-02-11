import { Request, Response, NextFunction } from "express";
import {z} from "zod"
import {prisma} from "../database/prisma"
import { taskPriority } from "@prisma/client";
import { AppError } from "@/utils/AppError";

export class TaskController {
    async create(request: Request, response: Response, next: NextFunction): Promise <void> {
        const bodySchema = z.object({
            title: z.string().trim().min(1, "Insira o nome da tarefa"),
            description: z.string().trim(),
            priority: z.string().trim().refine(value => ['low', 'medium', 'high', 'emergency'].includes(value), {message: "Insira um nível de prioridade a esta tarefa, os niveis existentes são: low, medium, high, emergency"}),
            assigned_to: z.string().trim(),
            teamId: z.string().trim().uuid("Insira o Id do time que ficará repsonsável pela tarefa!")
        })

        const {title, description, priority, assigned_to, teamId} = bodySchema.parse(request.body)

        const userExists = await prisma.user.findUnique({ where: { id: assigned_to } });
        if (!userExists) {
            return next(new AppError("Usuário não encontrado", 404));
        }
 
        const teamExists = await prisma.team.findUnique({ where: { id: teamId } });
        if (!teamExists) {
            return next(new AppError("Time não encontrado", 404));
        }

        const task = await prisma.task.create({
            data: {
                title,
                description,
                priority: priority as taskPriority,
                assignedTo: assigned_to,
                teamId
            },
            include: {
                team: true
            }
        })

        response.status(201).json({Tarefa: task})
    }

    async index(request: Request, response: Response, next: NextFunction): Promise <void> {
        
        
        const { title } = request.query;
        const {status} = request.query
        const {id} = request.query
        const {priority} = request.query

        const filter: any = {}
        if (title) {
            filter.title = {
                contains: String(title),
                mode:"insensitive"
            }
        }

        if (status) {
            filter.status = {
                equals: String(status)
            }
        }

        if (priority) {
            filter.priority = {
                equals: String(priority)
            }
        }
        
        if (id) {
            filter.id = {
                contains: String(id),
                mode: "insensitive"
            } 
        }

        const tasks = await prisma.task.findMany({
            where: filter
        })

        response.json({tasks})
    }

    async show(request: Request, response: Response, next: NextFunction): Promise <void> {
        
        const {id } = request.params
        const task = await prisma.task.findUnique({
            where: {id}
        })

        if (!task) {
            throw new AppError("Tarefa não encontrada", 400)
        }

        response.json({task})
    }

    async update (request: Request, response: Response, next: NextFunction): Promise <void> {
        const {id} = request.params

        if (!id) {
            throw new AppError("Informe o Id da tarefa", 400)
        }

        const task = await prisma.task.findUnique({
            where: {id}
        })

        if (!task) {
            throw new AppError("Informe o Id da tarefa", 400)
        }

        const { title, description, priority, status } = request.body;

        const updateData: any = {};

        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (priority) updateData.priority = priority;
        if (status) updateData.status = status;

        if (task.status === "completed") {
            throw new AppError("Esta tarefa já foi marcada como concluída e não pode mais ser atualizada")
        }

        const updatedTask = await prisma.task.update({
            where: { id },
            data: updateData
        });

        response.json({ updatedTask });
    }

    async delete (request: Request, response: Response, next: NextFunction): Promise <void> {
        const {id} = request.params

        await prisma.task.delete({
            where: {id}
        })

        response.json({Mensagem: "Deletado com sucesso"})
    }
}

