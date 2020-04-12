import  * as fastify from 'fastify';
import db from '../db/index';
import validator from '../utils/requestValidator';
import Responses from '../utils/responses';

class userController{

    static async createUser(request, response){
        validator(request, response);

        const {first_name, last_name, email, password} = request.body;
        console.log(request.body);

        let user = await db.query(`SELECT email FROM users WHERE email=$1`, [email]);
        
        if (user.rowCount > 0) {
            return response.status(404).send({message: "User exists"});
        };
        try {
            user = await db.query(`INSERT INTO users(first_name, last_name, email, password) VALUES($1, $2, $3, $4)`,
            [first_name, last_name, email, password]);
            response.send({ code: '001', message: 'User created', success: 'User created successfully' });
        } catch (error) {
            console.log(error);
        }
        
    };


    static async fetchAllUsers(request, response){
        try {
            const users = await db.query(`SELECT * FROM users`);
            return response.status(200).send(Responses.reponseData('000', 'fetch', users.rows))
        } catch (error) {
            console.log("error");
        }
    }


    static async fetchUserByEmail(request, response) {
        validator(request, response);

        try {
            const { email } = request.params;
            console.log(email);
            const user = await db.query(`SELECT * FROM users WHERE email=$1`, [email]);
            if (user.rowCount < 1) {
                return response.code(400).send({ code: '001', message: 'Invalid credentials', error: 'No user with specified email exists' });
            }else{
                return response.status(200).send(Responses.reponseData('000', 'fetch', user.rows))
            }
        } catch (error) {
            console.log("error");
        }
    }


    static async updateById(request, response) {
        validator(request, response);

        const{id} = request.params;
        const {first_name, last_name, email, password} = request.body;

        try {
            
            let user = await db.query(`UPDATE users SET first_name=$1, last_name=$2, email=$3, password=$4  WHERE user_id=${id}`,
            [first_name, last_name, email, password]);
            
            if(user.rowCount === 0) {
                return response.code(400).send({ code: '001', message: 'Invalid credentials', error: 'No user with specified id exists' });
            }

            response.send({ code: '001', message: 'User updated', success: 'User updated successfully' });
        } catch (error) {
            console.log("error");
        }
    }


    static async deleteById(request, response) {
        validator(request, response);

        const {id} = request.params;

        try {
            let user = await db.query(`DELETE FROM users  WHERE user_id=$1`,[id]);
            if (user.rowCount === 0) {
                return response.code(400).send({ code: '001', message: 'Invalid credentials', error: 'No user with specified id exists' });
            }

            response.send('User deleted successfully');
        } catch (error) {
            console.log("error");
        }

    }

};

export default userController;