const express = require("express");
const router=express.Router()
const path = require("path")
const rootdir=require("../util/path")


router.get("/signup",(req,res,next)=>{
    res.sendFile(path.join(rootdir,"views","signup.html"))
})
module.exports=router;