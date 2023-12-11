const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middleware/verifyToken");

const TodoCtrl = require("../controllers/todo");

router.post("/create-todo", verifyToken, TodoCtrl.AddTodo);

router.get("/all-todo", verifyToken, TodoCtrl.GetAllTodo);

router.put("/edit-todo", verifyToken, TodoCtrl.EditTodo);
router.put("/todo-complete", verifyToken, TodoCtrl.CompleteTodo)

router.delete("/delete-todo/:id", verifyToken, TodoCtrl.DeleteTodo);
router.delete("/delete-all", verifyToken, TodoCtrl.DeleteAll);

module.exports = router;
