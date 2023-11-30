const path = require("path");
const express = require("express");
const controller = require("../controller/chatapp");
const userauthentician = require("../middleware/authetication");
const multerMiddleware = require('../middleware/multer')
const upload = multerMiddleware.multer.single('image');
const router = express.Router();

router.get("/chatapp",controller.chatapp)
router.post("/message",userauthentician.authorization,controller.message)
router.post("/post-image",userauthentician.authorization,upload,controller.saveChatImages)
router.get("/getAllmessage/:productid",userauthentician.authorization,controller.getMessage)
router.post("/user/create-group",userauthentician.authorization,controller.createGroup)
router.post('/user/update-group',userauthentician.authorization,controller.updateGroup)
router.post("/common/message",userauthentician.authorization,controller.commonmessage)
router.get("/getcommon/message",userauthentician.authorization,controller.getcommonmessage)
router.get('/get-mygroups',userauthentician.authorization,controller.getMygroups)
router.get('/get-group-members',controller.getGroupMembersbyId)
router.delete('/delete-group',controller.deleteGroupbyId);
module.exports=router