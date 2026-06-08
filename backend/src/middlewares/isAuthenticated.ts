import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

interface PayLood {
    sub: string;
}

export function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
) {
    // 1. Log para ver se o header está chegando ao servidor
    const authToken = req.headers.authorization;
    console.log("--- DEBUG AUTH ---");
    console.log("Header Authorization recebido:", authToken);

    if (!authToken) {
        console.log("ERRO: Nenhum token enviado no header.");
        return res.status(401).end();
    }

    // 2. Log para ver se a divisão do token está correta
    const parts = authToken.split(" ");
    console.log("Partes do header:", parts);

    if (parts.length !== 2 || parts[0] !== "Bearer") {
        console.log("ERRO: Formato do token inválido. Esperado 'Bearer <token>'");
        return res.status(401).end();
    }

    const token = parts[1];
    
    try {
        // 3. Verificação de segurança
        if (!process.env.JWT_SECRET) {
             console.error("ERRO: Variável JWT_SECRET não configurada no servidor!");
        }

        const { sub } = verify(
            token, 
            process.env.JWT_SECRET as string
        ) as PayLood;

        req.user_id = sub;
        console.log("SUCESSO: Usuário autenticado. ID:", sub);
        return next();

    } catch (err) {
        // 4. Log detalhado do erro de verificação (aqui está o segredo!)
        console.error("ERRO: Falha na validação do token:", err);
        return res.status(401).end();
    }
}