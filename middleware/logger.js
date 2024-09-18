const express = require('express')
const app = express()

const logger = app.use((req,res,next) =>{
    console.log(`${req.method} ${req.url}`);
    next();
})

module.exports = logger