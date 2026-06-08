import { AppError } from "../../middlewares/AppError";
import prismaClient from "../../prisma";

interface DelReq{
    id: string
}

class DeleteReciclagemService{

    async execute({ id }: DelReq){

        const registroExistente = await prismaClient.registroReciclagem.findFirst({
            where: { id }
        });

        if (!registroExistente) {
            throw new AppError("Registro não encontrado", 404);
        }

        const registroApagado = await prismaClient.registroReciclagem.delete({
            where: { id }
        });

        return {
            message: "Registro deletado",
            registro: registroApagado
        }

    }

}

export { DeleteReciclagemService }