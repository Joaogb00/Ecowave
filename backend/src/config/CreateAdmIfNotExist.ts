import prismaClient from "../prisma";
import { hash } from "bcryptjs";

export async function createAdmIfNotExist() {

    const admin = await prismaClient.usuario.findMany({
        where: { papel: "ADMIN" }
    });

    if (admin.length > 0) {
        return true;
    }

    const senhaHash = await hash(process.env.PASS_ADM, 8);

    const novoAdm = await prismaClient.usuario.create({
        data: {
            nome: "Administrador",
            email: process.env.EMAIL_ADM,
            senha: senhaHash,
            papel: "ADMIN"
        }
    });
    
    return novoAdm;

}