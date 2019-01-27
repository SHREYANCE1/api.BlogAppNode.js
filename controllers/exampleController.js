const express = require('express')

let printExample = (req,res) => res.send('print example')

module.exports = {
    printExample: printExample
}