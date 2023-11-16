const path=require("path")
const express=require("express");
const cors = require('cors');
require('dotenv').config();
const signuproutes = require("./routes/signup")
const PORT = process.env.PORT;
const app=express();
app.use(cors());

const bodyParser=require("body-parser")
const sequelize = require('./util/database');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))

app.use(signuproutes)




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