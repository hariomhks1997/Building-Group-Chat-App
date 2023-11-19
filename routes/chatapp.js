const path = require("path");
const express = require("express");
const controller = require("../controller/chatapp");
const userauthentician = require("../middleware/authetication");
const router = express.Router();

router.get("/chatapp",controller.chatapp)
router.post("/message",userauthentician.authorization,controller.message)
router.get("/getAllmessage/:productid",userauthentician.authorization,controller.getMessage)
router.post("/user/create-group",userauthentician.authorization,controller.createGroup)
router.post("/common/message",userauthentician.authorization,controller.commonmessage)
router.get("/getcommon/message",userauthentician.authorization,controller.getcommonmessage)
router.get('/get-mygroups',userauthentician.authorization,controller.getMygroups)
module.exports=router