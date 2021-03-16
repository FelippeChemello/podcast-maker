import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import MakeController from '@modules/make/infra/http/controllers/MakeController';

const makeRouter = Router();
const makeController = new MakeController();

makeRouter.post('/', makeController.create);

export default makeRouter;
