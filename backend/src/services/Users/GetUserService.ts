import prismaClient from "../../prisma";

class GetUserService {
    async execute() {
        const users = await prismaClient.usuario.findMany({
            orderBy: {
                criadoEm: "desc"
            }
        });

        if (users.length <= 0) {
            return {
                message: "Nenhum usuario cadastrado",
                usuarios: [] // Retorna array vazio explicitamente para o frontend
            };
        }

        return {
            message: "Usuarios encontrados",
            usuarios: users
        };
    }
}

export { GetUserService };