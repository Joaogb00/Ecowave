import { AppError } from "../../middlewares/AppError";
import prismaClient from "../../prisma";


interface MaterialReq{
    nome: string
    fatorCO2: number
    pontosPorKg: number
    
}

class PostMaterialService{

    async execute({nome, fatorCO2, pontosPorKg}: MaterialReq){

        const materialCriado = await prismaClient.material.findFirst({
            where: { nome }
        });

        if (materialCriado) {
            
            throw new AppError("Material ja existente", 409);

        }

        const novoMaterial = await prismaClient.material.create({
            data:{
                nome: nome,
                fatorCO2: fatorCO2,
                pontosPorKg: pontosPorKg
            }            
        });

        return {
            message: "Material Cadastrado",
            material: novoMaterial
        };

    }

}

export { PostMaterialService }