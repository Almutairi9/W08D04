const jwt = require("jsonwebtoken");
require("dotenv").config();
const SECRET = process.env.SECRET_KEY;

const authentication = (req, res,next) => {
    
  try {
      if(!req.headers.authorization) { 
      return res.status(403).json({ message : "forbidden"})}
      const token = req.headers.authorization.split(" ")[1];
    //   console.log(req.headers.authorization.split(" ")[1]);
     
 
      const parsedToken = jwt.verify(token , SECRET);
       console.log(parsedToken);
      req.token = parsedToken;
      next();
  }
  catch (error) {
      res.status(403).json(error);
  }
};

module.exports = authentication;
