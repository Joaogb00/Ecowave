import prismaClient from "../../prisma";

class GetMaterialService {
    async execute(nomeIA?: string) {
        
        // Caso venha um nome da IA, busca apenas o material correspondente
        if (nomeIA) {
            const material = await prismaClient.material.findFirst({
                where: {
                    nome: {
                        contains: nomeIA,
                        mode: 'insensitive' // Ignora maiúsculas e minúsculas
                    }
                }
            });

            return material;
        }

        // Caso contrário, busca todos os materiais ordenados pelo mais recente
        const materiais = await prismaClient.material.findMany({
            orderBy: {
                criadoEm: "desc"
            }
        });

        // Verifica se a lista está vazia
        if (materiais.length <= 0) {
            return {
                message: "Nenhum material cadastrado"
            };
        }

        // Retorna a lista completa com uma mensagem de sucesso
        return {
            message: "Materiais Encontrados",
            materiais: materiais
        };
    }
}

export { GetMaterialService };