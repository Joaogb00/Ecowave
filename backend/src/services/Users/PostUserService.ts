import { AppError } from "../../middlewares/AppError";
import prismaClient from "../../prisma";
import { hash } from "bcryptjs";

interface UserReq{
    nome: string
    email: string
    senha: string
    papel:string
}


class PostUserService{

    async execute({nome, email, senha,papel}: UserReq){

        const UsuarioCadastrado = await prismaClient.usuario.findFirst({
            where: {email}
        });

        if (UsuarioCadastrado) {
            throw new AppError("Usuario ja existente", 409)
        };

        const senhaHash = await hash(senha,8);

        const NovoUsuario = await prismaClient.usuario.create({
            data:{
                nome,
                email,
                senha: senhaHash,
                papel
            }
        });

        return {
            message: "Usuario cadastrado com sucesso",
            usuario: NovoUsuario
        };

    }

}

export { PostUserService }