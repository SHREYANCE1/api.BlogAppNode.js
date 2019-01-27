//const library

const logger = require('./../libs/loggerLib')
const response = require('./../libs/responseLib')

let isAuthenticated = (req,res,next) => {
    if(req.params.authToken || req.query.authToken || req.header('authToken')){
        if(req.params.authToken =='Admin' || req.query.authToken =='Admin'|| req.header('authToken') =='Admin' ){
            req.user ={ fullName : 'Admin', userId: 'Admin'}
            next();
        } else {
            logger.error('Incorrect Authentication token','Authentication Middleware',5)
            let apiResponse = response.generate(true,'Incorrect Authentication token',403,null)
            res.send(apiResponse)
        }
    } else {
        logger.error(' Authentication token Missing','Authentication Middleware',5)
        let apiResponse = response.generate(true,'Authentication token is missing',403,null)
            res.send(apiResponse)
    }
}

module.exports = {
    isAuthenticated: isAuthenticated
}