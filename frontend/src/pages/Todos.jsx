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
import { useDebounce } from "../hooks/useDebounce";

const Todos = () => {
	const [todos, setTodos] = useState([]);
	const [status, setStatus] = useState("loading");
	const [errorMessage, setErrorMessage] = useState("");
	const [search, setSearch] = useState("");
	const [filter, setFilter] = useState("all");
	const [showForm, setShowForm] = useState(false);
	const [formError, setFormError] = useState("");
	const debouncedSearch = useDebounce(search, 300);

	const fetchTodos = useCallback(async () => {
		setStatus("loading");
		try {
			const params = { search: debouncedSearch };
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
	}, [debouncedSearch, filter]);

	useEffect(() => {
		fetchTodos();
	}, [fetchTodos]);

	const handleCreate = async (values) => {
		try {
			setFormError("");
			await createTodo(values);
			setShowForm(false);
			fetchTodos();
		} catch (err) {
			setFormError(err.response?.data?.message || "Failed to create todo.");
		}
	};

	const handleToggleComplete = async (todo) => {
		try {
			await updateTodo(todo._id, { completed: !todo.completed });
			fetchTodos();
		} catch (err) {
			setStatus("error");
			setErrorMessage(
				err.response?.data?.message || "Failed to update todo.",
			);
		}
	};

	const handleDelete = async (todo) => {
		try {
			await deleteTodo(todo._id);
			fetchTodos();
		} catch (err) {
			setStatus("error");
			setErrorMessage(
				err.response?.data?.message || "Failed to delete todo.",
			);
		}
	};

	new_str: return (
		<div className="max-w-2xl mx-auto p-4 sm:p-6">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-semibold text-gray-900">Todo App</h1>
				<button
					onClick={() => setShowForm((v) => !v)}
					className="px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 transition-colors"
				>
					{showForm ? "Close" : "+ Add Todo"}
				</button>
			</div>

			<div className="flex flex-col sm:flex-row gap-3 mb-6">
				<input
					type="text"
					placeholder="Search todos..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900/10"
				/>
				<select
					value={filter}
					onChange={(e) => setFilter(e.target.value)}
					className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-gray-900/10"
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
					{formError && (
						<p className="text-sm text-red-500 mt-2">{formError}</p>
					)}
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
