
const express = require("express");
const signuproutes = require("./routes/signup")

const app = express();
app.use(express.static('public'));
app.use(signuproutes)




app.listen(3000);