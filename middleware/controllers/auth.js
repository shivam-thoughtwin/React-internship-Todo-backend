const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../model/authModels");
const dbConfig = require("../config/secret");

exports.RegisterUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(500)
      .json({ statusCode: 500, msg: "No empty fields allowed" });
  }

  const userName = await User.findOne({
    username,
  });
  if (userName) {
    return res
      .status(409)
      .json({ statusCode: 409, msg: "Username already exist" });
  }

  const userEmail = await User.findOne({
    email: email.toLowerCase(),
  });
  if (userEmail) {
    return res
      .status(409)
      .json({ statusCode: 409, msg: "E-mail already exist" });
  }

  return bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res
        .status(400)
        .json({ statusCode: 400, msg: "Error in hashing password" });
    }

    const body = {
      username,
      email,
      password: hash,
    };
    User.create(body)
      .then((user) => {
        const token = jwt.sign({ id: user.id }, dbConfig.secret, {
          expiresIn: "24h",
        });
        res.status(201).json({
          statusCode: 201,
          msg: "User created successfully!",
          token,
        });
      })
      .catch((error) => {
        res
          .status(500)
          .json({ statusCode: 500, msg: "Internal error occured" });
      });
  });
};

exports.LoginUser = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(500).json({ msg: "No empty fields allowed" });
  }

  if (req.body.email) {
    await User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ msg: "Invalid Credentials" });
        }

        return bcrypt
          .compare(req.body.password, user.password)
          .then((result) => {
            if (!result) {
              return res.status(404).json({ msg: "Invalid Credentials" });
            }

            const token = jwt.sign({ id: user.id }, dbConfig.secret, {
              expiresIn: "24h",
            });
            return res
              .status(200)
              .json({ statusCode: 200, msg: "Login Successfully!", token });
          });
      })
      .catch((err) => {
        return res.status(500).json({ msg: "Error occured" });
      });
  }
};
