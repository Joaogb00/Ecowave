import { AppError } from "../../middlewares/AppError";
import prismaClient from "../../prisma";

interface PutReq {
    id: string,
    materialId?: string
    usuarioId?: string
    pontoColetaId?: string
    pesoKg?: number
}

class PutReciclagemService {

    async execute({ id, materialId, usuarioId, pontoColetaId, pesoKg }: PutReq) {

        const registroExistente = await prismaClient.registroReciclagem.findFirst({
            where: { id }
        });

        if (!registroExistente) {
            throw new AppError("Registro não encontrado", 404);
        }

        const registroEditado = await prismaClient.registroReciclagem.update({
            where: { id },
            data: {
                pesoKg,
                materialId,
                usuarioId,
                pontoColetaId
            },
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true
                    }
                },

                material: {
                    select: {
                        nome: true
                    }
                },

                pontoColeta: {
                    select: {
                        endereco: true
                    }
                }
            }
        });

        return { 

            message:"Registro atualizado com sucesso",
            registro: registroEditado

        }

    }

}

export { PutReciclagemService }