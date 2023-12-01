const path=require("path")
const http=require("http")
const express=require("express");
const { Server } = require("socket.io");
const cors = require('cors');
require('dotenv').config();

const chatmessage = require('./model/chatapp');
const signup = require('./model/signup')
const Group = require("./model/group");
const GroupMember = require('./model/group-members');
const common=require("./model/commonmessage")
const cronService = require('./services/cron');
cronService.job.start();

const signuproutes = require("./routes/signup")
const signinroutes=require("./routes/signin")
const chatapproutes=require("./routes/chatapp")
const PORT = process.env.PORT;
const app=express();

const server=http.createServer(app)
const io=new Server(server)
io.on('connection', (socket) => {
    console.log('a user connected',socket.id);
    socket.on("usermessage",(message)=>{
        console.log(message)
        io.emit("message",message)
    })
  });
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


signup.hasMany(common);
common.belongsTo(signup,{constraints:true, onDelete:'CASCADE'}); 
signup.hasMany(chatmessage);
chatmessage.belongsTo(signup,{constraints:true, onDelete:'CASCADE'}); 
signup.belongsToMany(Group, { through: GroupMember });
Group.belongsToMany(signup, { through: GroupMember });
Group.belongsTo(signup,{foreignKey: 'AdminId',constraints:true,onDelete:'CASCADE'})
Group.hasMany(chatmessage);
chatmessage.belongsTo(Group,{constraints:true, onDelete:'CASCADE'});

async function initiate(){
    try {
        await sequelize.sync();
        server.listen(PORT,()=>{
            console.log(`Server is running at ${PORT}`);
        });       
    } catch (error) {
        console.log(error);
    }
}
initiate();