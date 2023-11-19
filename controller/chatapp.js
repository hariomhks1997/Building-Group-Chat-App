const path = require("path")
const rootdir = require("../util/path")
const chatmessage = require("../model/chatapp")
const Group = require('../model/group')
const common=require("../model/commonmessage")




exports.chatapp=async (req,res,)=>{
    res.sendFile(path.join(rootdir, "views", "chatapp.html"))
}
exports.message=async (req,res,)=>{
    const user=req.user
    const message=req.body.message;
    const GroupId=req.body.GroupId;
    console.log(req.body)
   
   try{
    const data=await user.createMessage({
        name:user.name,
        message:message,
        GroupId:GroupId
       })
       res.status(201).json({message:"message send sucessfully",data:data})
   }catch(err){
    res.status(400).json({message:"message send failed"})
    console.log(err)
   }
   
}

exports.getMessage=async (req,res)=>{
    
    const groupid=req.params.productid
    console.log(groupid)
        try{
            const data=await chatmessage.findAll({
                attributes: ['id', 'name', 'userId','message','GroupId'],
          order: [['id', 'DESC']],
          where: {
            GroupId: Number(groupid),
        },
          limit:25,
            })
           
               res.status(200).json({data:data})
           }catch(err){
            res.status(400).json({message:"message getting failed"})
           }   
  
    
}
exports.commonmessage=async (req,res,)=>{
    const user=req.user
    const message=req.body.message;
    const GroupId=req.body.GroupId;
   
   
   
   try{
    const data=await user.createCommonmessage({
        name:user.name,
        message:message,
        GroupId:GroupId
       
       })
       res.status(201).json({message:"message send sucessfully",data:data})
   }catch(err){
    res.status(400).json({message:"message send failed"})
    console.log(err)
   }
   
}
exports.getcommonmessage=async (req,res)=>{
   
    try{
        const data=await common.findAll({
            attributes: ['id', 'name', 'userId','message','GroupId'],
      order: [['id', 'DESC']],
      limit:25,
        })
     
           res.status(200).json({data:data})
       }catch(err){
        res.status(400).json({message:"message getting failed"})
       }   


}
exports.createGroup = async (request, response, next) => {
    console.log("1",request.body)
    try {
        const user = request.user;
        const { name, membersNo, membersIds } = request.body;
        const group = await user.createGroup({
            name,
            membersNo,
            AdminId: user.id
        })
        
        membersIds.push(user.id);
        await group.addUsers(membersIds.map((ele) => {
            return Number(ele)
        }));
          
        
        return response.status(200).json({ group, message: "Group is succesfylly created" })

    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: 'Internal Server error!' })
    }
}

exports.getMygroups = async (request, response, next) => {
    try {
        const user = request.user;
        const groups = await user.getGroups();
        console.log(groups)
        return response.status(200).json({ groups, message: "All groups succesfully fetched" })

    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: 'Internal Server error!' })
    }
}