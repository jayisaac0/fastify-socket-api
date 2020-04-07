const validator = (request, response) => {
    if (request['validationError']) {
        request['validationError'].validation.map( mes => {
            return response.code(400).send({ code: '001', message: 'Invalid credentials', error: mes.message });
        });
    };
}

export default validator;