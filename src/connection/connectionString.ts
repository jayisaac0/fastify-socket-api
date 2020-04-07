require('dotenv').config();

class ConnectionStrings {
    static dbString(){
        if (process.env.NODE_ENV === 'test') {
            return require('../../config/development.json');
        }
        return process.env.NODE_ENV === 'production' ?require('../../config/development.json'):require('../../config/development.json');
    }
}

export default ConnectionStrings;