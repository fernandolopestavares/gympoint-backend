import { Router } from 'express';

import StudentController from './app/controllers/StudentController';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import OrderController from './app/controllers/OrderController';

import authMiddleware from './app/middlewares/auth';

const routes = Router();

routes.post('/users', UserController.store);
routes.put('/users/:id', UserController.update);

routes.post('/sessions', SessionController.store);

routes.post('/students/:id/checkins', CheckinController.store);
routes.get('/students/:id/checkins', CheckinController.index);

routes.post('/students/:id/help-orders', HelpOrderController.store);
routes.put('/students/:id/help-orders', HelpOrderController.update);

routes.use(authMiddleware);

routes.get('/students/help-orders', OrderController.index);

routes.get('/students/help-orders/:id', OrderController.show);

routes.post('/help-orders/:id/answer', OrderController.store);

routes.get('/students', StudentController.index);
routes.get('/students/:id', StudentController.show);
routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);
routes.delete('/student/:id', StudentController.delete);

routes.get('/plans', PlanController.index);
routes.get('/plans/:id', PlanController.show);
routes.post('/plans', PlanController.store);
routes.put('/plans/:plan_id', PlanController.update);
routes.delete('/plans/:plan_id', PlanController.delete);

routes.post('/registrations/:student_id', RegistrationController.store);
routes.get('/registrations', RegistrationController.index);
routes.get('/registrations/:id', RegistrationController.show);
routes.put('/registrations/:regist_id', RegistrationController.update);
routes.delete('/registrations/:regist_id', RegistrationController.delete);

export default routes;
