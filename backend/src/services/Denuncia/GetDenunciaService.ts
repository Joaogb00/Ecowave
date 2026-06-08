import prismaClient from "../../prisma";

class GetDenunciaService{

    async execute(){

        const denuncias = await prismaClient.denuncia.findMany({
            orderBy:{
                criadoEm: "desc"
            }
        });

        if (denuncias.length <= 0 ) {
            
            return{ message: "Nenhuma denuncia encontrada" }

        }

        return{
            message: "Denuncias encontradas",
            denuncias: denuncias
        }

    }

}

export { GetDenunciaService }