import * as fastify from 'fastify';
import * as WebSocket from 'ws';
import Responses from '../utils/responses';
require('../models/user.model')();
import {RouteSchema} from '../@types/routeschema';
import Requests from '../utils/requests';
import validator from '../utils/requestValidator';
import db from '../db/index';


export default (app: fastify.FastifyInstance) => {


        const wss = new WebSocket.Server(app);


        wss.on('connection', (socket: WebSocket) => {

            socket.isAlive = true;

            socket.on('pong', () => {
                socket.isAlive = true;
            });

            //connection is up, let's add a simple simple event
            socket.on('message', (message: string) => {


                const payload = JSON.parse(message);

                switch (payload.url) {
                    case '/users/create':
                        
                        const { first_name, last_name, email, password } = payload.body;

                        const action = 'users';

                        const userInterface = {
                            first_name: {type: 'string', minLength: 4},
                            last_name: {type: 'string', minLength: 4, maxLength: 255 },
                            email: {type: 'string'},
                            password: {type: 'string'},
                        };
                    
                        /**
                         * CREATE ITEM SOCKET ACTION
                         */
                        const createUserSchema: RouteSchema = {
                            tags: [`${action}`], 
                            summary: ` Create new ${action} endpoint`,
                            body:  {
                                type: 'object',
                                additionalProperties: false,
                                properties: userInterface,
                                required: ['first_name', 'last_name', 'email', 'password']
                            },
                            response: {
                                400: {
                                    type: 'object',
                                    properties: {
                                        code: { type: 'number' },
                                        message: { type: 'string' },
                                        error: {type: 'string'}
                                    }        
                                },
                                200: {
                                    type: 'object',
                                    properties: {
                                        code: { type: 'number' },
                                        message: { type: 'string' },
                                        success: {type: 'string'},
                                        data: {
                                            type: 'array', items: {
                                                type: 'object',
                                                properties: {
                                                    ...userInterface
                                                }
                                            }
                                        }
                                    }  
                                }
                            }
                        }
                        
                        socket.send(JSON.stringify(payload.body));
                        
                        break;
                
                    default:
                        break;
                }




                // console.log('received: %s', message);
                // const broadcastRegex = /^broadcast\:/;
                // if (broadcastRegex.test(message)) {
                //     message = message.replace(broadcastRegex, '');
                //     socket.clients
                //         .forEach(client => {
                //             if (client != socket) {
                //                 client.send(`Hello, broadcast message -> ${message}`);
                //             }    
                //         });
                    
                // } else {
                //     socket.send(`Hello, you sent -> ${JSON.stringify({data: message})}`);
                // }
            });

            socket.on('close', () => {
                console.log("I lost a client");
            });

            console.log("One more cient conected");

        });

        setInterval(() => {
            wss.clients.forEach((ws: WebSocket) => {
                
                if (!ws.isAlive) return ws.terminate();
                
                ws.isAlive = false;
                ws.ping(null, false, true);
            });
        }, 10000);

    
};

