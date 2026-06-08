import { AppError } from "../../middlewares/AppError";
import prismaClient from "../../prisma";

class GetReciclagemService{
    async execute(){

        const registros = await prismaClient.registroReciclagem.findMany({
            orderBy:{
                criadoEm: "desc"
            }
        });

        if (registros.length <= 0) {
            throw new AppError("Não existem registros", 404)
        }

        return{
            message: "Registros encontrados",
            registros: registros
        }

    }
}

export { GetReciclagemService }