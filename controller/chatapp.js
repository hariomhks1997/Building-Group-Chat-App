const path = require("path")
const rootdir = require("../util/path")
const chatmessage = require("../model/chatapp")

exports.chatapp=async (req,res,)=>{
    res.sendFile(path.join(rootdir, "views", "chatapp.html"))
}
exports.message=async (req,res,)=>{
    const user=req.user
    const message=req.body.message;
   console.log("request",user)
   try{
    user.createMessage({
        message:message
       })
       res.status(201).json({message:"message send sucessfully"})
   }catch(err){
    res.status(400).json({message:"message send failed"})
   }
   
}