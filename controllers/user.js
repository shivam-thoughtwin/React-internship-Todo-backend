const User = require("../model/authModels");

exports.getMe = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findOne({ _id });
  if (!user) {
    return res.status(404).json({ statusCode: 404, msg: "User not found." });
  }

  const data = {
    username: user.username,
    email: user.email,
  };
  return res
    .status(200)
    .json({ statusCode: 200, msg: "User fetch successfully.", data });
};
