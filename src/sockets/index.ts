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


        wss.on('connection', (ws: WebSocket) => {

            ws.isAlive = true;

            ws.on('pong', () => {
                ws.isAlive = true;
            });

            //connection is up, let's add a simple simple event
            ws.on('message', (message: string) => {
                console.log('received: %s', message);

                const broadcastRegex = /^broadcast\:/;





                if (broadcastRegex.test(message)) {
                    message = message.replace(broadcastRegex, '');
                    wss.clients
                        .forEach(client => {
                            if (client != ws) {
                                client.send(`Hello, broadcast message -> ${message}`);
                            }    
                        });
                    
                } else {
                    ws.send(`Hello, you sent -> ${message}`);
                }
            });

            ws.on('close', () => {
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

