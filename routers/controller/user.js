const usersModel = require("./../../db/models/user");

const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

dotenv.config();

const SALT = Number(process.env.SALT);
const SECRET = process.env.SECRET_KEY;

const transport = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  service: "Gmail",
  auth: {
    // user: process.env.EMAIL,
    // pass: process.env.EMAIL_PASSWORD,
    user: "rawan90f@gmail.com",
    password: "0555080894",
  },
});

const signup = async (req, res) => {
  const { email, password, userName, pic, role } = req.body;

  const lowerCaseEmail = email.toLowerCase();
  const lowerCaseuserName = userName.toLowerCase();

  const userExists = await usersModel.findOne({
    $or: [{ userName: lowerCaseuserName }, { email: lowerCaseEmail }],
  });

  if (!userExists) {
    //// ERROR userExists is not defined...................
    const hashedPassword = await bcrypt.hash(password, SALT);

    let activeCode = "";
    const characters = "0123456789";
    for (let i = 0; i < 4; i++) {
      activeCode += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    const newUser = new usersModel({
      email: lowerCaseEmail,
      password: hashedPassword,
      userName: lowerCaseuserName,
      passwordCode: "",
      activeCode,
      role,
      pic,
    });

    newUser
      .save()
      .then((result) => {
        transport
          .sendMail({
            from: process.env.EMAIL,
            to: lowerCaseEmail,
            subject: "change Your Password",
            html: `<h1>change Your Password</h1>
            <h2> Hi Dear : ${result.userName}</h2>
            <h4> Your CODE is : ${passwordCode}</h4>
            <p>Please enter your code on the following link and change your password</p>
            <a href=Linke ${result._id}> Click here</a> 
            </div>`,
          })
          .catch((err) => console.log(err));
        res.status(201).json(result);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.json({
      message: "Email or Username already taken!",
    });
  }
};

const verifyAccount = async (req, res) => {
  const { id, code } = req.body;

  const user = await usersModel.findOne({ _id: id });

  if (user.activeCode == code) {
    usersModel
      .findByIdAndUpdate(id, { active: true, activeCode: "" }, { new: true })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  } else {
    res.status(400).json("the code is Wrong ! ..");
  }
};

const verifyEmail = async (req, res) => {
  const { email } = req.body;

  const user = await usersModel.findOne({ email });

  if (user) {
    let passwordCode = "";
    const characters = "0123456789";
    for (let i = 0; i < 4; i++) {
      passwordCode += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    usersModel
      .findByIdAndUpdate(user._id, { passwordCode }, { new: true })
      .then((result) => {
        transport
          .sendMail({
            from: process.env.EMAIL, 
            to: result.email,
            subject: "change Your Password",
            html: `<h1>change Your Password</h1>
            <h2> Hi Dear : ${result.userName}</h2>
            <h4> Your CODE is : ${passwordCode}</h4>
            <p>Please enter your code on the following link and change your password</p>
            <a href=Linke ${result._id}> Click here</a> 
            </div>`,
          })
          .catch((err) => console.log(err));
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  } else {
    res.status(400).json("No user with this email");
  }
};

const resetPassword = async (req, res) => {
  const { id, code, password } = req.body;

  const user = await usersModel.findOne({ _id: id });

  if (user.passwordCode == code) {
    const hashedPassword = await bcrypt.hash(password, SALT);

    usersModel
      .findByIdAndUpdate(
        id,
        { password: hashedPassword, passwordCode: "" },
        { new: true }
      )
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  } else {
    res.status(400).json("the Code is Wrong ! ");
  }
};
const login = (req, res) => {
  const { userRegister, password } = req.body;

  const userRegisterTo = userRegister.toLowerCase();

  usersModel
    .findOne({ $or: [{ userName: userRegister }, { email: userRegister }] })
    .populate("role")
    .then(async (result) => {
      console.log(result);
      if (result) {
        if (result.deleted === false) {
          // console.log(result.userName == userRegisterTo);
          // console.log(result.email == userRegisterTo);
          if (
            result.userName == userRegisterTo ||
            result.email == userRegisterTo
          ) {
            console.log("result");
            const matchedPassword = await bcrypt.compare(
              password,
              result.password
            );

            if (matchedPassword) {
              const payload = {
                id: result._id,
                email: result.email,
                role: result.role.role,
                userName: result.userName,
                deleted: result.deleted,
              };

              const options = {
                expiresIn: "4h",
              };

              const token = jwt.sign(payload, SECRET, options);

              res.status(200).json({ result, token });
            } else {
              res.status(400).json({ message: "invalid e-mail or password !" });
            }
          } else {
            res.status(400).json({ message: "invalid e-mail or password !" });
          }
        } else {
          res.status(404).json({ message: "the user is deleted !" });
        }
      } else {
        res.status(404).json({ message: "e-mail does not exist !" });
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const getUsers = (req, res) => {
  if (!req.token.deleted) {
    usersModel
      .find({})
      .then((result) => {
        if (result.length > 0) {
          res.status(200).json(result);
        } else {
          res.status(404).json({ message: "there is no users found !" });
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(404).json({ message: "the user is deleted !" });
  }
};

const deleteUser = (req, res) => {
  if (!req.token.deleted) {
    const { id } = req.params;

    usersModel
      .findByIdAndUpdate(id, { deleted: true })
      .then(() => {
        if (result) {
          res
            .status(200)
            .json({ message: " the user hsa been deleted successfully .." });
        } else {
          res.status(404).json({ message: `there is no user with ID: ${id}` });
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(404).json({ message: "your user is deleted !" });
  }
};

module.exports = {
  signup,
  login,
  getUsers,
  deleteUser,
  verifyAccount,
  verifyEmail,
  resetPassword,
};
