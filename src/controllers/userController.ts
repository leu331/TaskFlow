import { Request, Response, NextFunction } from "express";
import {z} from "zod"
import {prisma} from "../database/prisma"
import { AppError } from "@/utils/AppError";
import {hash} from "bcrypt"
import {format} from "date-fns"
import { ptBR } from "date-fns/locale";

// const date = new Date()
// export const formatedDate = format(date, "dd 'de' MMMM 'de' yyyy 'às' hh:mm:ss", {locale: ptBR})
// console.log(formatedDate)

export class UserController {
    async create(request: Request, response: Response, next: NextFunction): Promise <void> {
        const bodySchema = z.object({
            name: z.string().trim().min(3),
            email: z.string().email().trim(),
            password: z.string()
            .min(8, "A senha precisa ter 8 caracteres")
            .regex(/[0-9]/, "A senha precisa ter pelo menos um número")
            .regex(/[A-Z]/, "A senha precisa ter pelo menos uma letra maiuscula")
        }) 
        
        const {name, email, password} = bodySchema.parse(request.body)

        const existingEmail = await prisma.user.findUnique({
            where: {email}
        })

        if (existingEmail) {
            throw new AppError("Este email já está em uso", 409)
        }

        const hashedPassword = await hash(password, 10)

       
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        })
        const {password: _, ...userWithoutPassword} = user

        response.status(201).json(userWithoutPassword)
    }
}