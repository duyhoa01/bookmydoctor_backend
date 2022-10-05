const express = require('express')
const db = require('./models')
const bodyParser = require('body-parser')

const app = express()
const port = 3000

app.use(bodyParser.json())

const route= require('./routes')

// Route init
route(app);

//static folder

app.use('/Images', express.static('./Images'))

//---------------------//

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`)
  await db.sequelize.authenticate()
})