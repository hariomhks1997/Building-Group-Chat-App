const path=require("path")
const express=require("express");
const cors = require('cors');
require('dotenv').config();

const chatmessage = require('./model/chatapp');
const signup = require('./model/signup')


const signuproutes = require("./routes/signup")
const signinroutes=require("./routes/signin")
const chatapproutes=require("./routes/chatapp")
const PORT = process.env.PORT;
const app=express();
app.use(cors({
    origin:process.env.WEBSITE,
    credentials:true,
    methods:["GET","POST","PUT","DELETE"]
}));

const bodyParser=require("body-parser")
const sequelize = require('./util/database');


app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

app.use(signinroutes)
app.use(signuproutes)
app.use(chatapproutes)


signup.hasMany(chatmessage);
chatmessage.belongsTo(signup,{constraints:true, onDelete:'CASCADE'}); 

async function initiate(){
    try {
        await sequelize.sync();
        app.listen(PORT,()=>{
            console.log(`Server is running at ${PORT}`);
        });       
    } catch (error) {
        console.log(error);
    }
}
initiate();