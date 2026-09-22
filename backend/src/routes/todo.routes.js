const express = require("express");
const router = express.Router();

const todoController = require("../controllers/todo.controller");
const {
	validateCreateTodo,
	validateUpdateTodo,
} = require("../validations/todo.validation");

router.post("/", validateCreateTodo, todoController.createTodo);
router.get("/", todoController.getTodos);
router.get("/:id", todoController.getTodoById);
router.put("/:id", validateUpdateTodo, todoController.updateTodo);
router.delete("/:id", todoController.deleteTodo);

module.exports = router;
