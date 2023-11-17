const path = require("path");
const express = require("express");
const controller = require("../controller/chatapp");
const userauthentician = require("../middleware/authetication");
const router = express.Router();
router.get("/chatapp",controller.chatapp)
router.post("/message",userauthentician.authorization,controller.message)
router.get("/getAllmessage",controller.getMessage)
module.exports=router