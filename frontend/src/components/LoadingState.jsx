const LoadingState = ({ message = "Loading..." }) => {
	return (
		<div className="flex items-center justify-center py-16 text-gray-500">
			<span>{message}</span>
		</div>
	);
};

export default LoadingState;
