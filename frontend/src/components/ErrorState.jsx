const ErrorState = ({ message = "Something went wrong.", onRetry }) => {
	return (
		<div className="flex flex-col items-center justify-center py-16 text-red-500 gap-3">
			<p>{message}</p>
			{onRetry && (
				<button
					onClick={onRetry}
					className="px-4 py-2 text-sm border border-red-300 rounded hover:bg-red-50"
				>
					Retry
				</button>
			)}
		</div>
	);
};

export default ErrorState;
