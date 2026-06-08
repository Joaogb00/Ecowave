import prismaClient from "../prisma";
import { Request, Response, NextFunction } from "express";
import { AppError } from "./AppError";


export async function isOwner(req: Request, res: Response, next: NextFunction) {

    const id = req.user_id

    const user = await prismaClient.usuario.findFirst({
        where: { id }
    })

    if (!user) {
        throw new AppError("Usuario não encontrado", 404);
    }

    if (user.papel != "PROPRIETARIO") {
        throw new AppError("Acesso negado!", 403);
    }

    return next();

}