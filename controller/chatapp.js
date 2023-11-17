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
    const data=await user.createMessage({
        name:user.name,
        message:message
       })
       res.status(201).json({message:"message send sucessfully",data:data})
   }catch(err){
    res.status(400).json({message:"message send failed"})
   }
   
}
exports.getMessage=async (req,res)=>{
   
        try{
            const data=await chatmessage.findAll()
            console.log(data)
               res.status(200).json({data:data})
           }catch(err){
            res.status(400).json({message:"message getting failed"})
           }   
  
    
}