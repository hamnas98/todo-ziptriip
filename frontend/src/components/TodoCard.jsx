import { useState } from "react";
import { Link } from "react-router-dom";

const TodoCard = ({ todo, onToggleComplete, onDelete }) => {
	const [confirmingDelete, setConfirmingDelete] = useState(false);

	const handleDeleteClick = () => {
		if (confirmingDelete) {
			onDelete(todo);
			setConfirmingDelete(false);
		} else {
			setConfirmingDelete(true);
		}
	};

	return (
		<div className="flex items-start justify-between gap-4 p-4 border border-gray-200 rounded-lg bg-white transition-colors hover:border-gray-300">
			<div className="flex items-start gap-3 flex-1 min-w-0">
				<input
					type="checkbox"
					checked={todo.completed}
					onChange={() => onToggleComplete(todo)}
					className="mt-1 shrink-0"
				/>
				<div className="min-w-0">
					<Link
						to={`/todo?id=${todo._id}`}
						className={`font-medium hover:underline break-words ${
							todo.completed
								? "line-through text-gray-400"
								: "text-gray-900"
						}`}
					>
						{todo.title}
					</Link>
					{todo.description && (
						<p className="text-sm text-gray-500 mt-1 break-words">
							{todo.description}
						</p>
					)}
				</div>
			</div>

			<div className="shrink-0 flex items-center gap-2">
				{confirmingDelete && (
					<button
						onClick={() => setConfirmingDelete(false)}
						className="text-sm text-gray-400 hover:text-gray-600"
					>
						Cancel
					</button>
				)}
				<button
					onClick={handleDeleteClick}
					className={`text-sm rounded px-2 py-1 transition-colors ${
						confirmingDelete
							? "bg-red-500 text-white hover:bg-red-600"
							: "text-red-500 hover:text-red-700"
					}`}
				>
					{confirmingDelete ? "Confirm?" : "Delete"}
				</button>
			</div>
		</div>
	);
};

export default TodoCard;
