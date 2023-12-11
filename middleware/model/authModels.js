const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String },
  todos: [
    {
      todoId: { type: mongoose.Schema.Types.ObjectId, ref: "Todo" },
      todo: { type: String },
      created: { type: Date, default: Date.now() },
    },
  ],
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
