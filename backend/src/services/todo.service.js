const mongoose = require("mongoose");
const Todo = require("../models/todo.model");

const createTodo = async ({ title, description }) => {
	const todo = await Todo.create({ title: title.trim(), description });
	return todo;
};

const getTodos = async ({ search, completed }) => {
	const filter = {};

	if (search) {
		filter.title = { $regex: search, $options: "i" };
	}

	if (completed !== undefined) {
		filter.completed = completed === "true";
	}

	const todos = await Todo.find(filter).sort({ createdAt: -1 });
	return todos;
};

const getTodoById = async (id) => {
	if (!mongoose.Types.ObjectId.isValid(id)) {
		const error = new Error("Invalid todo ID");
		error.statusCode = 400;
		throw error;
	}

	const todo = await Todo.findById(id);

	if (!todo) {
		const error = new Error("Todo not found");
		error.statusCode = 404;
		throw error;
	}

	return todo;
};

const updateTodo = async (id, updates) => {
	if (!mongoose.Types.ObjectId.isValid(id)) {
		const error = new Error("Invalid todo ID");
		error.statusCode = 400;
		throw error;
	}

	if (updates.title !== undefined) {
		updates.title = updates.title.trim();
	}

	const todo = await Todo.findByIdAndUpdate(id, updates, {
		new: true,
		runValidators: true,
	});

	if (!todo) {
		const error = new Error("Todo not found");
		error.statusCode = 404;
		throw error;
	}

	return todo;
};

const deleteTodo = async (id) => {
	if (!mongoose.Types.ObjectId.isValid(id)) {
		const error = new Error("Invalid todo ID");
		error.statusCode = 400;
		throw error;
	}

	const todo = await Todo.findByIdAndDelete(id);

	if (!todo) {
		const error = new Error("Todo not found");
		error.statusCode = 404;
		throw error;
	}

	return todo;
};

module.exports = { createTodo, getTodos, getTodoById, updateTodo, deleteTodo };
