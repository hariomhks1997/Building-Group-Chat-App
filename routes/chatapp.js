const path = require("path");
const express = require("express");
const controller = require("../controller/chatapp");
const router = express.Router();
router.get("/chatapp",controller.chatapp)
module.exports=router