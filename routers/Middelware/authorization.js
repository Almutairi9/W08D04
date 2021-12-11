const roleModel = require("./../../db/models/role");

const authorization = (req, res, next) => {
  try {

    console.log("rawan authorization  ..................try..........");
    //  const relatedId = req.token.role;
    //  const result = await roleModel.findById(relatedId);
   console.log(req.token.role);
    if (req.token.role === "Admin") {
      console.log("rawan authorization  ............................");
      next();
    } else {
      // console.log("token");
      return res.status(403).json({ message: "forbidden" });
    }
  } catch (error) {
    res.status(403).json(error);
  }
};

module.exports = authorization;
