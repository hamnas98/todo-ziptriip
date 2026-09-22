import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getTodoById } from "../services/todoApi";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

const TodoDetails = () => {
	const [searchParams] = useSearchParams();
	const id = searchParams.get("id");

	const [todo, setTodo] = useState(null);
	const [status, setStatus] = useState("loading");
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		if (!id) {
			setStatus("error");
			setErrorMessage("No todo ID provided.");
			return;
		}

		const fetchTodo = async () => {
			setStatus("loading");
			try {
				const data = await getTodoById(id);
				setTodo(data);
				setStatus("success");
			} catch (err) {
				if (err.response?.status === 404) {
					setStatus("not-found");
				} else {
					setStatus("error");
					setErrorMessage(
						err.response?.data?.message || "Failed to load todo.",
					);
				}
			}
		};

		fetchTodo();
	}, [id]);

	return (
		<div className="max-w-2xl mx-auto p-4 sm:p-6">
			<Link
				to="/todos"
				className="text-sm text-gray-500 hover:underline inline-flex items-center gap-1"
			>
				&larr; Back to Todos
			</Link>

			<div className="mt-4">
				{status === "loading" && <LoadingState message="Loading todo..." />}
				{status === "error" && <ErrorState message={errorMessage} />}
				{status === "not-found" && <ErrorState message="Todo not found." />}
				{status === "success" && todo && (
					<div className="p-6 border border-gray-200 rounded-lg bg-white">
						<div className="flex items-start justify-between gap-4">
							<h1
								className={`text-2xl font-semibold break-words ${
									todo.completed
										? "line-through text-gray-400"
										: "text-gray-900"
								}`}
							>
								{todo.title}
							</h1>
							<span
								className={`shrink-0 text-xs font-medium px-2 py-1 rounded-full ${
									todo.completed
										? "bg-green-50 text-green-700"
										: "bg-amber-50 text-amber-700"
								}`}
							>
								{todo.completed ? "Completed" : "Incomplete"}
							</span>
						</div>
						{todo.description && (
							<p className="mt-3 text-gray-600">{todo.description}</p>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default TodoDetails;
