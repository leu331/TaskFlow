import {Request, Response, NextFunction, ErrorRequestHandler} from "express"
import { AppError } from "@/utils/AppError"
import { ZodError } from "zod"
import { request } from "http"

export const errorHandling: ErrorRequestHandler = (error, request, response, next) => {
    if (error instanceof ZodError) {
        response.status(400).json({mensagem: "Erro de validação", issues: error.format()})
    }

    if (error instanceof AppError) {
        response.status(error.statusCode).json(error.message)
    }

    else {
        console.error(error)
        response.status(500).json({mensagem: "Erro interno do servidor"})
    }
}