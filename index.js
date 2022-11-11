const express = require('express')
// const db = require('./models')
const bodyParser = require('body-parser')
const connectDB = require('./src/config/connectDB');
const http = require('http');
const server = http.createServer(app);

const app = express()
const port = 3000

const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions)) // Use this after the variable declaration

app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

server.listen(port, () => {
  console.log('listening on *:' + port);
});

const route= require('./src/routes')

// Route init
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use("/api",route)

connectDB()

//static folder

app.use('/Images', express.static('./Images'))

//---------------------//

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`)
  // await db.sequelize.authenticate()
})