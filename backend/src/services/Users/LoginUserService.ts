import prismaClient from "../../prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { AppError } from "../../middlewares/AppError";

interface LoginReq{
    email: string
    senha: string
}
//teste
//teste
class LoginUserService{

    async execute({ email, senha }: LoginReq){

        const usuarioExistente = await prismaClient.usuario.findFirst({
            where: { email }
        })

        if (!usuarioExistente) {
            throw new AppError("Usuario Não Existente", 404)
            
        }

        const passwordMatch = await compare(senha, usuarioExistente.senha)

        if (!passwordMatch) {
                throw new Error("Senha Incorreta")
        }

        const token = await sign(
            {
                nome: usuarioExistente.nome,
                email: usuarioExistente.email
            },
            process.env.JWT_SECRET,
            {
                subject: usuarioExistente.id,
                expiresIn: '1h'
            }
        )


        return {
            message: "Login efetuado com sucesso",
            id: usuarioExistente.id,
            nome: usuarioExistente.nome,
            email: usuarioExistente.email,
            role: usuarioExistente.papel,
            fotoPerfil: usuarioExistente.fotoPerfil,
            token: token
        }

    }

}

export { LoginUserService }