import prismaClient from "../../prisma";

interface PostReq {
    usuarioId: string;
    pontoColetaId: string;
    titulo: string;
    descricao: string;
}

class PostDenunciaService {

    async execute({ usuarioId, pontoColetaId, titulo, descricao }: PostReq) {

        const novaDenuncia = await prismaClient.denuncia.create({
            data: {
                titulo,
                descricao,
                usuario: {
                    connect: { id: usuarioId }
                },
                pontoColeta: {
                    connect: { id: pontoColetaId }
                }
            },
            include: {
                usuario: {
                    select: {
                        id: true,
                        nome: true
                    }
                },
                pontoColeta: {
                    select: {
                        nome: true,
                        endereco: true
                    }
                }
            }
        });

        return {
            message: "Denuncia feita com sucesso",
            denuncia: novaDenuncia
        };
    }
}

export { PostDenunciaService };