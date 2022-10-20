const express = require('express')
const db = require('./models')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

// const cors=require("cors");
// const corsOptions ={
//    origin:'*', 
//    credentials:true,            //access-control-allow-credentials:true
//    optionSuccessStatus:200,
// }

// app.use(cors(corsOptions)) // Use this after the variable declaration

app.use(bodyParser.json())

const route= require('./routes')

// Route init
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use("/api",route)

//static folder

app.use('/Images', express.static('./Images'))

//---------------------//

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`)
  await db.sequelize.authenticate()
})