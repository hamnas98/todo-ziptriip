const errorHandler = (err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.statusCode ? err.message : "Internal server error";

	if (!err.statusCode) {
		console.error(err);
	}

	res.status(statusCode).json({
		success: false,
		message,
	});
};

module.exports = errorHandler;
