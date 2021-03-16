import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import 'express-async-errors';

import '@shared/infra/typeorm';
import '@shared/container';

import routes from './routes';
import AppError from '@shared/errors/AppError';

const port = process.env.PORT || 3333;

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
}); // Tratativa dos erros globais precisa ocorrer após as rotas, pois nela é que pode gerar algum erro

app.listen(port, () => {
  console.log(`🚀 Server started on port ${port}`);
});
