import * as fastify from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import * as fastifyFormbody from 'fastify-formbody';
import * as dotenv from 'dotenv';
import routes from './routes';
import * as fastswagger from 'fastify-swagger';
import * as http from 'http';
import * as WebSocket from 'ws';
import socketRoutes from './sockets';

const app: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify(
    {
        logger: true,
        trustProxy: true
    }
);
app.register(fastifyFormbody);

app.register(fastswagger, {
    exposeRoute: true,
    routePrefix: '/api/documentation',
    swagger: {
        info: {
            title: 'PET MANAGER SERVICE',
            description: 'pet manager site service',
            version: '1.0.0'
        },
        host: '0.0.0.0:2500',
        schemes: "",
        consumes: ['application/json'],
        produces: ['application/json'],
        tags: [
            { name: 'users', description: 'users related endpoints' }
        ],
        securityDefinitions: {
            "Authorization": {
                "type": "apiKey",
                "name": "Authorization",
                "in": "header"
            }
        }
    }
});

routes(app);
socketRoutes(app);


app.listen(2500, '0.0.0.0', (err, address) => {
    if(err){
        app.log.error(err);
        process.exit(1);
    }
    app.log.info(`Server listening on ${address}`);
});

module.exports = app;