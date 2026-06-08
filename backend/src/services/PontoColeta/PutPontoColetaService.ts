import { AppError } from "../../middlewares/AppError";
import prismaClient from "../../prisma";

interface PutReq {
    id: string;
    userId: string;
    nome: string;
    endereco: string;
    CEP: string;
    horarioAbertura: string;
    horarioFechamento: string;
    materiaisIds: string[];
}

class PutPontoColetaService {
    async execute({ id, userId, nome, endereco, CEP, horarioAbertura, horarioFechamento, materiaisIds }: PutReq) {

        const cleanIds = materiaisIds.filter(mid => 
            mid !== undefined && 
            mid !== null && 
            mid !== 'undefined' && 
            mid !== 'null' && 
            mid.trim() !== ''
        );

        const materiaisExistentes = await prismaClient.material.findMany({
            where: { id: { in: cleanIds } },
            select: { id: true }
        });

        const idsValidos = materiaisExistentes.map(m => m.id);

        try {
            const usuarioLogado = await prismaClient.usuario.findUnique({
                where: { id: userId },
                select: { papel: true }
            });

            const PontoExistente = await prismaClient.pontoDeColeta.findFirst({
                where: { id }
            });

            if (!PontoExistente) throw new AppError("Ponto não encontrado", 404);

            const ehAdmin = usuarioLogado?.papel === 'ADMIN' || usuarioLogado?.papel === 'ADMINISTRADOR';
            if (!ehAdmin && PontoExistente.criadoPorId !== userId) {
                throw new AppError("Acesso negado", 403);
            }

            const resultado = await prismaClient.$transaction(async (tx) => {
                
                await tx.pontoColetaMaterial.deleteMany({
                    where: { pontoColetaId: id }
                });

                return await tx.pontoDeColeta.update({
                    where: { id },
                    data: {
                        nome,
                        endereco,
                        CEP,
                        horarioAbertura,
                        horarioFechamento,
                        materiais: {
                            create: idsValidos.map((materialId) => ({
                                material: { connect: { id: materialId } }
                            }))
                        }
                    },
                    include: { materiais: { include: { material: true } } }
                });
            });

            return {
                message: "Ponto de Coleta editado com sucesso",
                ponto: resultado
            };

        } catch (error: any) {
            throw new AppError("Falha ao processar atualização no banco de dados.", 500);
        }
    }
}

export { PutPontoColetaService };