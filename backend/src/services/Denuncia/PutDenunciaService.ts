import { AppError } from "../../middlewares/AppError";
import prismaClient from "../../prisma";

interface PutReq {
    id: string;
    usuarioId: string;
    pontoColetaId?: string;
    titulo : string
    descricao?: string;
}

class PutDenunciaService {

    async execute({ id, usuarioId, pontoColetaId, titulo, descricao }: PutReq) {

        const denunciaExistente = await prismaClient.denuncia.findFirst({
            where: { id }
        });

        // Verifica se a denúncia realmente existe
        if (!denunciaExistente) {
            throw new AppError("Denuncia nao existente", 404);
        }

        // Verifica se o usuário logado é o dono da denúncia
        if (usuarioId !== denunciaExistente.usuarioId) {
            throw new AppError("Voce nao possui permissão para editar essa denuncia", 403);
        }

        const denunciaEditada = await prismaClient.denuncia.update({
            where: { id },
            data: {
                pontoColetaId,
                titulo,
                descricao
            },
            include: {
                pontoColeta: {
                    select: {
                        nome: true,
                        endereco: true
                    }
                }
            }
        });

        return {
            message: "Denuncia editada com sucesso",
            denuncia: denunciaEditada
        };

    }

}

export { PutDenunciaService };