const Todo = require("../model/todo");
const User = require("../model/authModels");

module.exports = {
  async AddTodo(req, res) {
    const { _id } = req.user;
    const body = {
      user: _id,
      todo: req.body.todo,
      created: new Date(),
    };

    if (req.body.todo) {
      Todo.create(body)
        .then(async (todo) => {
          await User.updateOne(
            { _id },
            {
              $push: {
                todos: {
                  todoId: todo._id,
                  todo: req.body.todo,
                  created: new Date(),
                },
              },
            }
          );
          return res
            .status(200)
            .json({ statusCode: 200, msg: "Todo created successfully!", todo });
        })
        .catch((err) => {
          res
            .status(500)
            .json({ statusCode: 500, msg: "Internal Server Error" });
        });
    }
  },

  async GetAllTodo(req, res) {
    try {
      const todos = await Todo.find({ user: req.user._id }).populate("user");

      return res.status(200).json({
        statusCode: 200,
        msg: "All Todos",
        todos: todos,
      });
    } catch (e) {
      return res.status(404).json({ msg: e });
    }
  },

  async DeleteTodo(req, res) {
    try {
      const { _id } = req.user;
      const { id } = req.params;
      const result = await Todo.findOneAndDelete({ _id: id });
      if (!result) {
        return res.status(404).json({ msg: "Could not delete todo." });
      } else {
        await User.updateOne(
          { _id },
          {
            $pull: {
              todos: {
                todoId: result._id,
              },
            },
          }
        );
        return res
          .status(200)
          .json({ statusCode: 200, msg: "Todo deleted successfully" });
      }
    } catch (e) {
      return res.status(500).json({ statusCode: 500, msg: e });
    }
  },

  async EditTodo(req, res) {
    const body = {
      todo: req.body.todo,
      created: new Date(),
    };
    await Todo.findOneAndUpdate({ _id: req.body.id }, body, { new: true })
      .then((todo) => {
        return res
          .status(200)
          .json({ statusCode: 200, msg: "Todo updated successfully", todo });
      })
      .catch((err) => {
        return res.status(500).json({ statusCode: 500, msg: err });
      });
  },

  async CompleteTodo(req, res) {
    try {
      const body = {
        isCompleted: true,
      };
      const result = await Todo.findOne({ _id: req.body.id });
      if (result.isCompleted) {
        return res
          .status(404)
          .json({ statusCode: 404, msg: "Already Completed" });
      }

      await Todo.findOneAndUpdate({ _id: req.body.id }, body, { new: true })
        .then((todo) => {
          return res
            .status(200)
            .json({ statusCode: 200, msg: "Todo Completed", todo });
        })
        .catch((err) => {
          return res.status(500).json({ statusCode: 500, msg: err });
        });
    } catch (err) {
      return res
        .status(500)
        .json({ statusCode: 500, msg: "Internal Server Error" });
    }
  },

  async DeleteAll(req, res) {
    try {
      const { _id } = req.user;
      const result = await Todo.deleteMany({ user: { $gte: _id } });
      if (!result) {
        return res.status(404).json({ msg: "Could not delete all todos." });
      } else {
        await User.updateOne({ _id }, { todos: [] });
        return res
          .status(200)
          .json({ statusCode: 200, msg: "All todos deleted successfully" });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ statusCode: 500, msg: "Internal Server Error" });
    }
  },
};
