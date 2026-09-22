import { useEffect, useState, useCallback } from "react";
import {
	getTodos,
	createTodo,
	updateTodo,
	deleteTodo,
} from "../services/todoApi";
import TodoCard from "../components/TodoCard";
import TodoForm from "../components/TodoForm";
import LoadingState from "../components/LoadingState";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";

const Todos = () => {
	const [todos, setTodos] = useState([]);
	const [status, setStatus] = useState("loading"); // loading | success | error
	const [errorMessage, setErrorMessage] = useState("");
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState("all"); // all | completed | incomplete
	const [showForm, setShowForm] = useState(false);

	const fetchTodos = useCallback(async () => {
		setStatus("loading");
		try {
			const params = { search };
			if (filter === "completed") params.completed = "true";
			if (filter === "incomplete") params.completed = "false";

			const data = await getTodos(params);
			setTodos(data);
			setStatus("success");
		} catch (err) {
			setStatus("error");
			setErrorMessage(
				err.response?.data?.message || "Failed to load todos.",
			);
		}
	}, [search, filter]);

	useEffect(() => {
		fetchTodos();
	}, [fetchTodos]);

	const handleCreate = async (values) => {
		await createTodo(values);
		setShowForm(false);
		fetchTodos();
	};

	const handleToggleComplete = async (todo) => {
		await updateTodo(todo._id, { completed: !todo.completed });
		fetchTodos();
	};

	const handleDelete = async (todo) => {
		const confirmed = window.confirm(`Delete "${todo.title}"?`);
		if (!confirmed) return;
		await deleteTodo(todo._id);
		fetchTodos();
	};

	return (
		<div className="max-w-2xl mx-auto p-6">
			<h1 className="text-2xl font-semibold text-gray-900 mb-6">Todo App</h1>

			<div className="flex gap-3 mb-4">
				<input
					type="text"
					placeholder="Search todos..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="flex-1 px-3 py-2 border border-gray-300 rounded"
				/>
				<select
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					className="px-3 py-2 border border-gray-300 rounded"
				>
					<option value="all">All</option>
					<option value="completed">Completed</option>
					<option value="incomplete">Incomplete</option>
				</select>
			</div>

			<button
				onClick={() => setShowForm((v) => !v)}
				className="mb-4 px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800"
			>
				{showForm ? "Close" : "+ Add Todo"}
			</button>

			{showForm && (
				<div className="mb-4">
					<TodoForm
						onSubmit={handleCreate}
						onCancel={() => setShowForm(false)}
					/>
				</div>
			)}

			<div className="flex flex-col gap-3">
				{status === "loading" && <LoadingState />}
				{status === "error" && (
					<ErrorState message={errorMessage} onRetry={fetchTodos} />
				)}
				{status === "success" && todos.length === 0 && (
					<EmptyState message="No todos found. Add one to get started." />
				)}
				{status === "success" &&
					todos.map((todo) => (
						<TodoCard
							key={todo._id}
							todo={todo}
							onToggleComplete={handleToggleComplete}
							onDelete={handleDelete}
						/>
					))}
			</div>
		</div>
	);
};

export default Todos;
