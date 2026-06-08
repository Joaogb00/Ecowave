import prismaClient from "../../prisma";
import { AppError } from "../../middlewares/AppError";

interface GetPontoReq{
    id: string
}

class GetPontoByOwnerService{

    async execute({id}: GetPontoReq){

        const pontos = await prismaClient.pontoDeColeta.findMany({
            where:{ criadoPorId: id, ativo: true },
            select:{
                id: true,
                nome: true,
                endereco: true,
                CEP: true,
                horarioAbertura: true,
                horarioFechamento: true,
                ativo: true
            },
            orderBy:{ criadoEm: 'desc' }
        });

        if (pontos.length <= 0) {
            throw new AppError("Esse usuario não possui pontos de coleta criados", 404)
        }

        return{
            message: "Pontos encontrados",
            pontos: pontos
        }

    }

}

export { GetPontoByOwnerService }