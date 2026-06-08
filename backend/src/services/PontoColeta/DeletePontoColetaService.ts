import { AppError } from "../../middlewares/AppError";
import prismaClient from "../../prisma";

interface DelReq {
    id: string
}

class DeletePontoColetaService {

    async execute({ id }: DelReq) {

        const PontoExistente = await prismaClient.pontoDeColeta.findFirst({
            where: { id }
        });

        if (!PontoExistente) {
            throw new AppError("Ponto de coleta nao existente", 404)
        }
        
        if (PontoExistente.ativo == false) {
            throw new AppError("Ponto de coleta ja desativado", 409)
        }

        const pontoDeletado = await prismaClient.pontoDeColeta.update({
            where: { id },
            data:{
                ativo: false
            },
            select: {
                id: true,
                nome: true,
                endereco:true,
                CEP: true,
                criadoPor:{
                    select:{
                        nome: true
                    }
                },
                ativo: true,
                criadoEm: true,
                editadoEm: true,
                lat: true,
                lng: true,
                horarioAbertura: true,
                horarioFechamento: true,
                materiais: {
                    select: {
                        material: {
                            select: {
                                nome: true,
                                pontosPorKg: true,
                                fatorCO2: true
                            }
                        }
                    }
                }
            }            
        });

        return {
            message: "Ponto Desativado",
            ponto: pontoDeletado
        }

    }

}

export { DeletePontoColetaService }