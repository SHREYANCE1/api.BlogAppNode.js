const response = require('./../libs/responseLib')

let errorHandler  = (err, req, res, next) => {
    console.log('application error handler is called');
    console.log(err)
    let apiResponse = response.generate(true,'some error occured at global level',500,null)
    res.send(apiResponse)
}// end application level error handler

let notFoundHandler = (req, res, next) => {
    console.log('global not-found handler is called')
    let apiResponse = response.generate(true,'Route not found in the application ',404,null)
    res.status(404).send(apiResponse)
} // end not found handler

module.exports = {
    errorHandler: errorHandler,
    notFoundHandler: notFoundHandler
}
