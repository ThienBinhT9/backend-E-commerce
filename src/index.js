const express = require('express')
const dotenv = require('dotenv')
const helmet = require('helmet')
const compression = require('compression')

const router = require('./routers')
const db = require('./configs/db.config')

dotenv.config()
const app = express()

//Init Middleware
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

//Connect DB
db.connect()

//Init Router
router(app)

// Handle error


//Listen sever run
app.listen(process.env.PORT, () => {
    console.log(`Sever is running with PORT: ${process.env.PORT}`)
})


