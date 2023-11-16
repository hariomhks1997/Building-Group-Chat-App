const path = require("path");
const rootdir = require("../util/path");
const Signup = require("../model/signup");
const bcrypt = require("bcrypt");
const sequelize = require("../util/database");
const { Op } = require('sequelize');

exports.getsignup = (req, res, next) => {
  res.status(200).sendFile(path.join(rootdir, "views", "signup.html"));
};
exports.postsignup = async (req, res) => {
    const t=await sequelize.transaction();
  try {
    const email = req.body.email;
    const password = req.body.password;
    const name = req.body.name;
    const mobile = req.body.mobile;

    const user = await Signup.findOne({
        where: {
            [Op.or]: [{ email }, { mobile }]
        }
    });
    console.log(user)
    if (user) {
      return res.status(404).json({ message: "User already exists" });
    } else {
      const response = await bcrypt.hash(password, 10);

      await Signup.create({
        name,
        email,
        mobile,
        password: response,
      },{transaction:t})
        .then(async () => {
            await t.commit()
          return res.status(201).json({ message: "Signup Data Sucessfully" });
        })
        .catch(async (err) => {
            await t.rollback()
          throw new Error(err);
        });
    }
  } catch (err) {
    await t.rollback()
    return res.status(500).json({ message: "Something Went Wrong" });
  }
};
exports.getpostsignup = async (req, res) => {
  console.log(req.body);
  try {
    const data = await Signup.findAll();
   
    let product = [];

    data.map((ele) => {
      product.push({ email: ele.email, id: ele.id });
    });
    res.status(200).json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Something Went Wrong" });
  }
};
