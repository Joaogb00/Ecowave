import { AppError } from "../../middlewares/AppError";
import prismaClient from "../../prisma";

interface DelReq{
    id: string
}

class DeleteDenunciaService{

    async execute({ id }: DelReq){

        const denunciaExistente = await prismaClient.denuncia.findFirst({
            where: { id }
        });

        if (!denunciaExistente) {
            throw new AppError("Denuncia não encontrada", 404);
        }

        const denunciaDeletada = await prismaClient.denuncia.delete({
            where: { id }
        });

        return{
            message: "Denuncia deletada com sucesso",
            denuncia: denunciaDeletada
        }

    }

}

export { DeleteDenunciaService }