import { Link } from "react-router-dom";

const TodoCard = ({ todo, onToggleComplete, onDelete }) => {
	return (
		<div className="flex items-start justify-between gap-4 p-4 border border-gray-200 rounded-lg bg-white">
			<div className="flex items-start gap-3 flex-1 min-w-0">
				<input
					type="checkbox"
					checked={todo.completed}
					onChange={() => onToggleComplete(todo)}
					className="mt-1"
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
			<button
				onClick={() => onDelete(todo)}
				className="text-sm text-red-500 hover:text-red-700 shrink-0"
			>
				Delete
			</button>
		</div>
	);
};

export default TodoCard;
