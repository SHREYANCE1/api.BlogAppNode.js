const express = require('express')
const exampleController = require('./../controllers/exampleController')
let setRouter = (app) => {
    
    app.get('/example',exampleController.printExample)
}

module.exports ={
    setRouter: setRouter
}