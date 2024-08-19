let express = require("express")
let app = express()
require("dotenv").config()
let cors = require("cors")

let corsOptions = {
origin :  'http://localhost:5173',
credentials:true
}
app.use(cors(corsOptions))
app.use(express.json())
app.listen(3030 , ()=>{
	console.log("server is connected")
})