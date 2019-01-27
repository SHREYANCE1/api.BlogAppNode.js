//example middleware function

let exampleMiddleware = (req, res, next) => {
    req.user = {'firstName':'Shreyance', 'lastName':'shreyance'}
    next();
}

module.exports = {
    exampleMiddleware: exampleMiddleware
}