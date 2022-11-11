const express = require('express')
// const db = require('./models')
const bodyParser = require('body-parser')
const connectDB = require('./src/config/connectDB');
const app = express()
const http = require('http');
const server = http.createServer(app);


const port = 3000

// const cors=require("cors");
// const corsOptions ={
//    origin:'*', 
//    credentials:true,            //access-control-allow-credentials:true
//    optionSuccessStatus:200,
// }

// app.use(cors(corsOptions)) // Use this after the variable declaration
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  // const allowedOrigins = ['http://localhost:3000', 'https://bookmydoctor.onrender.com/', 'https://bookmydoctor.onrender.com/'];
  // const origin = req.headers.origin;
  // if (allowedOrigins.includes(origin)) {
  //      res.setHeader('Access-Control-Allow-Origin', origin);
  // }
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
  next();
});

app.use(bodyParser.json())



const route= require('./src/routes')

// Route init
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use("/api",route)


connectDB()

//static folder

app.use('/Images', express.static('./Images'))

//---------------------//

// app.listen(port, async () => {
//   console.log(`Example app listening on port ${port}`)
//   // await db.sequelize.authenticate()
// })
let io= require('socket.io')(server);

io.on('connection', (socket) => {
  console.log(`${socket.id}`)
})
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
