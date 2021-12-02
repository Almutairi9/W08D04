const roleModel = require("./../../db/models/role");

const authorization = async (req, res, next) => {
  try {
    console.log(req.token);
    const relatedId = req.token.role;
    const result = await roleModel.findById(relatedId);

    if (result.role == "Admin") {
      next();
    } else {
      return res.status(403).json({ message: "forbidden" });
    }
  } catch (error) {
    res.status(403).json(error);
  }
};

module.exports = authorization;
