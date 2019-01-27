//importing express js to our application
const express = require('express')
const appConfig = require('./config/appConfig')
const fs = require('fs')

//importing mongoose
const mongoose = require('mongoose')
//importing cookie parser
const cookieParser = require('cookie-parser')
//importing body-parser
const bodyParser = require('body-parser')
//importing custom middleware
const globalErrorHandler = require('./middlewares/appErrorHandler')
const routeLoggerMiddlware = require('./middlewares/routeLogger')
const helmet = require('helmet')
const http = require('http')
const logger = require('./libs/loggerLib')
const response = require('./libs/responseLib')
//declaring the instance or creating an application instance
const app = express()

//middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())
app.use(helmet())
app.use(globalErrorHandler.errorHandler)

const server = http.createServer(app)


app.use(routeLoggerMiddlware.logIp)
// bootstrap models
let modelsPath = './models'
fs.readdirSync(modelsPath).forEach(function (file){
    if(~file.indexOf('.js')) require(modelsPath+'/'+file)
})
// end bootstrap models

//bootstrap route
let routesPath = './routes'
fs.readdirSync(routesPath).forEach(function (file) {
    if (~file.indexOf('.js')){
        console.log('including the following file')
        console.log(routesPath+'/'+file)
        let route = require(routesPath+'/'+file)
        route.setRouter(app)
    }
})
// end bootstarp route

//global 404 handler
app.use(globalErrorHandler.notFoundHandler)
// end global 404 handler

//start listening to http server
server.listen(appConfig.port)
server.on('error',onError)
server.on('listening',onListening)

function onError(error) {
    if(error.syscall != 'listen'){
        logger.error(error.code+'not equal listen','serverOnError',10)
        throw error
    }

    //handle specific error
    switch(error.code){
        case 'EACCES':
            logger.error(error.code+'elevated priviliges required','serverOnError',10)
            process.exit(1)
            break
        case 'EADDRINUSE':
             logger.error(error.code+'address port already in use','serverOnError',10)
             process.exit(1)
             break
        default:
            logger.error(error.code+'some other error occured','serverOnError',10)
            throw error
    }
}//end onerror

function onListening() {
    var addr = server.address()
    var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
    ('Listening on '+ bind)
    logger.info('server listening on port'+addr.port,'server onListening handler',10)
    let db = mongoose.connect(appConfig.db.uri,{
        useNewUrlParser: true,
        useCreateIndex: true  
      });
}

process.on('unhandledRejection',(reason,p) => {
    console.log('Unhandled rejection at promise',p,'reason:',reason)
    //application specific logging, throwing an error 
})

//handling mongoose connection error
mongoose.connection.on('error',function(err){
    console.log('database connection error')
    console.log(err)
}); // end mnongoose connection error

//handling mongoose connection error
mongoose.connection.on('open',function(err){
    if(err){
        console.log("database error")
        console.log(err)
    } else {
        console.log("database connection open success")
    }
}); // end mongoose connection handler