import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import router from './router';
import cors from 'cors'
import { AppError } from './middlewares/AppError';
import { createAdmIfNotExist } from './config/CreateAdmIfNotExist';
import path from 'path';
const app = express()

// 1. Configuração do CORS primeiro
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Parsers de dados com o limite de 10mb (a linha duplicada que quebrava o código foi removida)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
// 3. Suas rotas
app.use(router)

// Middleware de tratamento de erros (Mantido exatamente igual)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            status: "Error",
            message: err.message
        })
    }
    
    console.error(err)

    return res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    })
})

// Função de inicialização do servidor (Mantido exatamente igual)
async function startServer() {
    await createAdmIfNotExist();

    app.listen(3000, () => 
        console.log("servidor online! Rodando na porta 3000 (http://localhost:3000)")
    );
}

startServer();