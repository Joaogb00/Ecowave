import { AppError } from "../../middlewares/AppError";
import prismaClient from "../../prisma";

interface PutReq{
    id: string,
    nome?: string
    fatorCO2?: number,
    pontosPorKg?: number
}

class PutMaterialService{

    async execute({id, nome, fatorCO2, pontosPorKg}: PutReq){

        const materialExistente = await prismaClient.material.findFirst({
            where:{
                id
            }
        });

        if (!materialExistente) {
            throw new AppError("Material não encontrado", 404);
        };

        const materialEditado = await prismaClient.material.update({
            where:{ id },
            data:{
                nome,
                fatorCO2,
                pontosPorKg
            }
        });

        return {
            message: "Material editado com sucesso",
            material: materialEditado
        }

    }

}

export { PutMaterialService }