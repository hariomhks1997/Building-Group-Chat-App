const path = require("path")
const rootdir = require("../util/path")

exports.chatapp=async (req,res,)=>{
    res.sendFile(path.join(rootdir, "views", "chatapp.html"))
}