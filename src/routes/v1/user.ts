import * as fastify from 'fastify';
import Responses from '../../utils/responses';
require('../../models/user.model')();
import {RouteSchema} from '../../@types/routeschema';
import userController from '../../controllers/user.controller';
import Requests from '../../utils/requests';

export default (app: fastify.FastifyInstance, options, done) => {

    const action = 'users';

    const userInterface = {
        first_name: {type: 'string', minLength: 4},
        last_name: {type: 'string', minLength: 4, maxLength: 255 },
        email: {type: 'string'},
        password: {type: 'string'},
    };

    /**
     * CREATE ITEM ENDPOINT
     */
    const createUserSchema: RouteSchema = {
        tags: [`${action}`], summary: ` Create new ${action} endpoint`,
        body: Requests.requestBody(userInterface, ['first_name', 'last_name', 'email', 'password']),
        response: {
            400: Responses.errorResponseObj(),
            200: Responses.successResponseObj(userInterface)
        }
    }
    app.post('/create', { schema: createUserSchema, attachValidation: true }, userController.createUser);

    /**
     * FETCH ALL ITEMS ENDPOINT 
     * PASS ADDITIONAL FIELDS THAT ARE NOT IN THE INTERFACE IN RESPONSE
     */
    const fetchAllUserSchema: RouteSchema = {
        tags: [`${action}`], summary: ` Fetch all ${action}s endpoint`,
        response: {
            400: Responses.errorResponseObj(),
            200: Responses.successResponseObj({ user_id: { type: 'string' }, ...userInterface })
        }
    }
    app.get('/fetch', { schema: fetchAllUserSchema }, userController.fetchAllUsers);

    /**
     * FETCH SINGLE ITEM BY EMAIL ENDPOINT
     */
    const fetchSingleUserSchema: RouteSchema = {
        tags: [`${action}`], summary: ` Fetch single ${action} by email endpoint`,
        params:{
            type: 'object',
            properties: {
                email:  {
                    type: 'string',
                    description: 'email'
                }
            }
        },
        response: {
            400: Responses.errorResponseObj(),
            200: Responses.successResponseObj({ user_id: { type: 'string' }, ...userInterface })
        }
    }
    app.get('/fetch/:email', { schema: fetchSingleUserSchema }, userController.fetchUserByEmail);

    /**
     * UPDATE SINGLE ITEM BY ID ENDPOINT
     */
    const updateUserSchema: RouteSchema = {
        tags: [`${action}`], summary: ` Update ${action} by id endpoint`,
        params:{
            type: 'object',
            properties: {
                usera_id: {
                    type: 'string',
                    description: 'user id'
                }
            }
        },
        body: Requests.requestBody(userInterface, ['first_name', 'last_name', 'email', 'password']),
        response: {
            400: Responses.errorResponseObj(),
            200: Responses.successResponseObj(userInterface)
        }
    }
    app.patch('/update/:id', { schema: updateUserSchema }, userController.updateById);

    /**
     * DELEE SINGLE ITEM BY ID ENDPOINT
     */
    const deleteSingleUserSchema: RouteSchema = {
        tags: [`${action}`], summary: ` Delete ${action} by id endpoint`,
        params:{
            type: 'object',
            properties: {
                usera_id: {
                    type: 'string',
                    description: 'user id'
                }
            }
        },
        response: {
            400: Responses.errorResponseObj(),
            200: Responses.successResponseObj(userInterface)
        }
    }
    app.delete('/delete/:id', { schema: deleteSingleUserSchema }, userController.deleteById);
    
    done();
};