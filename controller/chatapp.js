const path = require("path")
const rootdir = require("../util/path")
const chatmessage = require("../model/chatapp")
const Group = require('../model/group')
const common=require("../model/commonmessage")
const awsservices=require("../services/awservices")



exports.chatapp=async (req,res,)=>{
    res.sendFile(path.join(rootdir, "views", "chatapp.html"))
}
exports.message=async (req,res,)=>{
    const user=req.user
    const message=req.body.message;
    const GroupId=req.body.GroupId;
    const date=req.body.date;
   
   
   try{
    const data=await user.createMessage({
        name:user.name,
        message:message,
        GroupId:GroupId,
        date:date
       })
       res.status(201).json({message:"message send sucessfully",data:data})
   }catch(err){
    res.status(400).json({message:"message send failed"})
    console.log(err)
   }
   
}

exports.getMessage=async (req,res)=>{
    
    const groupid=req.params.productid
   
        try{
            const data=await chatmessage.findAll({
                attributes: ['id', 'name', 'userId','message','GroupId','isImage'],
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
    const date=req.body.date;
   
   
   
   try{
    const data=await user.createCommonmessage({
        name:user.name,
        message:message,
        GroupId:GroupId,
        date:date
       
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
            attributes: ['id', 'name', 'userId','message','GroupId','isImage'],
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
exports.updateGroup = async (request, response, next) => {
    console.log(request.body)
    try {
        const user = request.user;
        const { groupId } = request.query;
        const group = await Group.findOne({ where: { id: Number(groupId) } });
        const { name, membersNo, membersIds } = request.body;
        const updatedGroup = await group.update({
            name,
            membersNo,
            AdminId: user.id
        })
        membersIds.push(user.id);
        await updatedGroup.setUsers(null);
        await updatedGroup.addUsers(membersIds.map((ele) => {
            return Number(ele)
        }));
        return response.status(200).json({ updatedGroup, message: "Group is succesfylly updated" })

    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: 'Internal Server error!' })
    }
}


exports.getMygroups = async (request, response, next) => {
    try {
        const user = request.user;
        const groups = await user.getGroups();
       
        return response.status(200).json({ groups, message: "All groups succesfully fetched" })

    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: 'Internal Server error!' })
    }
}
exports.getGroupMembersbyId = async (request, response, next) => {
   
    try {
        const { groupId } = request.query;
        console.log("23",groupId)
        const group = await Group.findOne({ where: { id: Number(groupId) } });
        const AllusersData = await group.getUsers();
        const users = AllusersData.map((ele) => {
            return {
                id: ele.id,
                name: ele.name,
            }
        })

        response.status(200).json({ users, message: "Group members name succesfully fetched" })
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: 'Internal Server error!' })
    }
}
exports.deleteGroupbyId = async (request, response, next) => {
   
    try {
        const { groupId } = request.query;
        console.log("23",groupId)
        const group = await Group.findOne({ where: { id: Number(groupId) } });
        group.destroy()
      
        response.status(200).json({  message: "Group deleted " })
    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: 'Internal Server error!' })
    }
}
exports.saveChatImages = async (request, response, next) => {
    try {
        const user = request.user;
        const image = request.file;
        const { GroupId } = request.body;
        const { date } = request.body;
        const filename = `chat-images/group${GroupId}/user${user.id}/${Date.now()}_${image.originalname}`;
        const imageUrl = await awsservices.uploadToS3(image.buffer, filename)
        console.log("4",imageUrl)
        if (GroupId == 0) {
            await user.createCommonmessage({
                name:user.name,
               
                GroupId:GroupId,
                message: imageUrl,
                isImage: true,
                date:date
            })
        } else {
            await user.createMessage({
                name:user.name,
        message:imageUrl,
        GroupId:GroupId,
        isImage: true,
        date:date


            })
        }

        return response.status(200).json({ message: "image saved to database succesfully" })

    } catch (error) {
        console.log(error);
        return response.status(500).json({ message: 'Internal Server error!' })
    }
}