import { Router } from 'express';

import makeRoutes from '@modules/make/infra/http/routes/make.routes';

const routes = Router();

routes.use('/make', makeRoutes);

export default routes;
