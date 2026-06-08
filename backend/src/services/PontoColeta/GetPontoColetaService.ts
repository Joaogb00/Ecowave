import prismaClient from "../../prisma";

class GetPontoColetaService {

    async execute() {

        const pontos = await prismaClient.pontoDeColeta.findMany({
            where: { ativo: true },
            orderBy: {
                criadoEm: "desc"
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

     
        if (pontos.length <= 0) {
            return {
                message: "Nenhum ponto de coleta cadastrado",
                pontos: [] 
            }
        }

        return {
            message: "Pontos Encontrados",
            pontos: pontos
        }
    }
}
export { GetPontoColetaService }