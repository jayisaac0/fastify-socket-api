import * as fastify from 'fastify';
import * as WebSocket from 'ws';
require('../models/user.model')();
import db from '../db/index';


export default (app: fastify.FastifyInstance) => {


        const wss = new WebSocket.Server(app);


        wss.on('connection', async  (socket: WebSocket) => {

            socket.isAlive = true;

            socket.on('pong', () => {
                socket.isAlive = true;
            });



            const getAllUsers = await db.query(`SELECT * FROM users`);
            socket.send(JSON.stringify({code: '001', message: 'User created', allUsers: getAllUsers.rows}));
                
            
            //connection is up, let's add a simple simple event
            socket.on('message', async(message: string) => {
                
                
                const payload = JSON.parse(message);
                const {first_name, last_name, email, password} = payload.body;
                
                
                switch (payload.url) {
                    case '/users/create':

                            let user = await db.query(`SELECT email FROM users WHERE email=$1`, [email]);
                            
                            if (user.rowCount > 0) {
                                return socket.send(JSON.stringify({message: "User exists"}));  
                            };
                            try {
                                user = db.query(`INSERT INTO users(first_name, last_name, email, password) VALUES($1, $2, $3, $4)`,
                                [first_name, last_name, email, password]);
                                // socket.send(JSON.stringify({ code: '001', message: 'User created', success: 'User created successfully' })); 
                                
                                const users = await db.query(`SELECT * FROM users`);
                                return socket.send(JSON.stringify({code: '001', message: 'User created', allUsers: users.rows}));                        
                            } catch (error) {
                                console.log(error);
                            }                    
                        break;
                    case '/users/fetch/:email':

                            const { emailparam } = payload.params;
                            console.log(email);
                            const fetchUserReq =  await db.query(`SELECT * FROM users WHERE email=$1`, [emailparam]);
                            if (fetchUserReq.rowCount < 1) {
                                return socket.send(JSON.stringify({ code: '001', message: 'Invalid credentials', error: 'No user with specified email exists' }));  
                            }else{
                                return socket.send(JSON.stringify({code: '001', message: 'User created', singleUser: fetchUserReq.rows}));                         
                            }
                            
                        break;
                    case '/users/update/:id':

                            const{id} = payload.params;
                            // const {first_name, last_name, email, password} = payload.body;
                            
                            let fetchUserToUpdate = await db.query(`UPDATE users SET first_name=$1, last_name=$2, email=$3, password=$4  WHERE user_id=${id}`,
                            [first_name, last_name, email, password]);
                            
                            if(fetchUserToUpdate.rowCount === 0) {
                                return socket.send(JSON.stringify({ code: '001', message: 'Invalid credentials', error: 'No user with specified id exists' }));  
                            }
                
                            // socket.send(JSON.stringify({ code: '001', message: 'User updated', success: 'User updated successfully' }));                    

                            const getAllUsers = await db.query(`SELECT * FROM users`);
                            return socket.send(JSON.stringify({code: '001', message: 'User updated', allUsers: getAllUsers.rows}));                       
                        break;
                    case '/users/delete/:id':

                            const {delete_id} = payload.params;

                            try {
                                let deleteUser = await db.query(`DELETE FROM users  WHERE user_id=$1`,[delete_id]);
                                if (deleteUser.rowCount === 0) {
                                    return socket.send(JSON.stringify({ code: '001', message: 'Invalid credentials', error: 'No user with specified id exists' }));  
                                }
                    
                                // socket.send(JSON.stringify({ code: '001', message: 'User updated', success: 'User deleted successfully' }));  

                                const getAllUsers = await db.query(`SELECT * FROM users`);
                                return socket.send(JSON.stringify({code: '001', message: 'User deleted', allUsers: getAllUsers.rows}));

                            } catch (error) {
                                console.log("error");
                            }
                        break;
                    default:
                        socket.send(JSON.stringify({code: '001', message: 'Error', details: 'Error experianced'}));
                        break;
                }
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

