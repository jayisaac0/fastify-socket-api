import * as fastify from 'fastify';

import userRoute from './v1/user';

export default (app: fastify.FastifyInstance) => {
    app.register(userRoute, { prefix: '/api/v1/user' });
    
};