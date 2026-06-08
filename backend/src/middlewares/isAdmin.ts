import { Request, Response, NextFunction } from "express";
import prismaClient from "../prisma";
import { AppError } from "./AppError";

export async function isAdmin(req:Request, res: Response, next: NextFunction) {
    
    const user_id = req.user_id;

    const user = await prismaClient.usuario.findFirst({
        where: { id: user_id }
    });

    if (!user) {
        throw new AppError("Usuario não encontrado", 404);
    }

    if (user.papel != "ADMIN") {
        throw new AppError("Acesso negado", 403);   
    }

    return next();

}
