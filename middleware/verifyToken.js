const jwt = require("jsonwebtoken");
const asyncHandler = require("./asyncHandler");
const dbConfig = require("../config/secret");

const User = require("../model/authModels");

const verifyToken = asyncHandler(async (req, res, next) => {
  let token;
  const { authorization } = req.headers;
  if (authorization) {
    token = authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(400)
      .json({ msg: "You are not logged in! Please log in to get access." });
  }

  const decode = await jwt.verify(token, dbConfig.secret);
  if (!decode && !decode.id) {
    return res
      .status(401)
      .json({
        statusCode: 401,
        msg: "The user belonging to this token does not longer exist.",
      });
  }


  let currentUser = null;
  currentUser = await User.findById(decode.id);
  
  req.user = currentUser;
  return next();
});

module.exports = {
  verifyToken,
};
