const usersModel = require("./../../db/models/user");

const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
dotenv.config();

const SALT = Number(process.env.SALT);
const SECRET = process.env.SECRET_KEY;

const signup = async (req, res) => {
  const { email, password, userName, pic, role } = req.body;

  const lowerCaseEmail = email.toLowerCase();
  const hashedPassword = await bcrypt.hash(password, SALT);

  const newUser = new usersModel({
    email: lowerCaseEmail,
    password: hashedPassword,
    role,
    userName,
    pic,
  });

  newUser
    .save()
    .then((result) => {
      res.status(201).json(result);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
};

const login = (req, res) => {
  const { email, userName, password } = req.body;
  let lowerCaseEmail;
  if(email){
   lowerCaseEmail = email.toLowerCase();
} 
   
  usersModel
    .findOne({ $or: [{ email }, { userName }] })
    .populate("role")
    .then(async (result) => {
      console.log(result);
      if (result) {
        if (result.deleted === false) {
          console.log(result.userName == userName);
          console.log(result.email == lowerCaseEmail);
          if ( result.userName == userName || result.email == lowerCaseEmail  ) {
            console.log("result");
            const matchedPassword = await bcrypt.compare(
              password,
              result.password
            );

            if (matchedPassword) {
              const payload = {
                id: result._id,
                email: result.email,
                role: result.role,
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


module.exports = { signup, login, getUsers, deleteUser };