const express = require('express')
const app = express()
const port = 3000

const route= require('./routes')

// Route init
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use("/api",route)

//---------------------//

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})