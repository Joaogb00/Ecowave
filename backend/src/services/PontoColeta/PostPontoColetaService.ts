import { AppError } from "../../middlewares/AppError";
import prismaClient from "../../prisma";

interface PostReq {
    nome: string;
    endereco: string;
    CEP: string;
    lat: number; 
    lng: number;
    horarioAbertura: string; 
    horarioFechamento: string;
    criadoPorId: string;
    materiaisIds: string[];
}

class PostPontoColetaService {
    async execute({ nome, endereco, CEP, lat, lng, horarioAbertura, horarioFechamento, criadoPorId, materiaisIds }: PostReq) {
        
        // Evita a criação de pontos duplicados com o mesmo CEP que estejam ativos
        const pontoCriado = await prismaClient.pontoDeColeta.findFirst({
            where: { CEP, ativo: true }
        });

        if (pontoCriado) {
            throw new AppError("Ponto de coleta já existente neste CEP", 409);
        }

        // Cria o ponto de coleta e injeta os relacionamentos na tabela intermediária
        const novoPonto = await prismaClient.pontoDeColeta.create({
            data: {
                nome,
                endereco,
                CEP,
                lat: Number(lat), // Garante que a coordenada seja salva como Float
                lng: Number(lng), // Garante que a coordenada seja salva como Float
                horarioAbertura,
                horarioFechamento,
                criadoPorId,
                materiais: {
                    // Mapeia o array de IDs recebidos do Vue direto para o campo estrutural do banco
                    create: materiaisIds.map((idDoMaterial) => ({
                        materialId: idDoMaterial
                    }))
                }
            },
            include: {
                criadoPor: {
                    select: {
                        nome: true
                    }
                },
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
            message: "Ponto de Coleta Cadastrado",
            pontoDeColeta: novoPonto
        };
    }
}

export { PostPontoColetaService };