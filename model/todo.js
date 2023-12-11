const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  todo: {
    type: String,
    required: true,
  },
  isCompleted: { type: Boolean, default: false },
  created: { type: Date, default: Date.now() },
});

// we will create a new collection
const Todo = new mongoose.model("Todo", todoSchema);

module.exports = Todo;
