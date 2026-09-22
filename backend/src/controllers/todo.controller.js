const todoService = require("../services/todo.service");

const createTodo = async (req, res, next) => {
	try {
		const { title, description } = req.body;
    
		const todo = await todoService.createTodo({ title, description });
		res.status(201).json({ success: true, data: todo });
	} catch (error) {
		next(error);
	}
};

const getTodos = async (req, res, next) => {
	try {
		const { search, completed } = req.query;
		const todos = await todoService.getTodos({ search, completed });
		res.status(200).json({ success: true, data: todos });
	} catch (error) {
		next(error);
	}
};

const getTodoById = async (req, res, next) => {
	try {
		const todo = await todoService.getTodoById(req.params.id);
		res.status(200).json({ success: true, data: todo });
	} catch (error) {
		next(error);
	}
};

const updateTodo = async (req, res, next) => {
	try {
		const { title, description, completed } = req.body;
		const updates = {};
		if (title !== undefined) updates.title = title;
		if (description !== undefined) updates.description = description;
		if (completed !== undefined) updates.completed = completed;

		const todo = await todoService.updateTodo(req.params.id, updates);
		res.status(200).json({ success: true, data: todo });
	} catch (error) {
		next(error);
	}
};

const deleteTodo = async (req, res, next) => {
	try {
		await todoService.deleteTodo(req.params.id);
		res.status(200).json({ success: true, data: {} });
	} catch (error) {
		next(error);
	}
};

module.exports = { createTodo, getTodos, getTodoById, updateTodo, deleteTodo };
