let express = require("express")
let app = express()
require("dotenv").config()
let cors = require("cors")
const dbConnect = require('./DB/dbConfig');
const withCredentials = require('./middleware/credentials');
let userRoute = require('./routes/auth.route');
const decodeToken = require('./helper/decodeToken');
let corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
dbConnect();
app.use(cors(corsOptions));
app.use(withCredentials);
app.use(express.json());
app.use('/auth', userRoute);
app.use('/islogin', decodeToken);
app.listen(3030 , ()=>{
	console.log("server is connected")
})