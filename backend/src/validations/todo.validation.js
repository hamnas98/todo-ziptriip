const validateCreateTodo = (req, res, next) => {
  const { title } = req.body;

  if (title === undefined || title === null) {
    const error = new Error('Title is required');
    error.statusCode = 400;
    return next(error);
  }

  if (typeof title !== 'string' || title.trim().length === 0) {
    const error = new Error('Title cannot be empty');
    error.statusCode = 400;
    return next(error);
  }

  next();
};

const validateUpdateTodo = (req, res, next) => {
  const { title, completed } = req.body;

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      const error = new Error('Title cannot be empty');
      error.statusCode = 400;
      return next(error);
    }
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    const error = new Error('Completed must be a boolean');
    error.statusCode = 400;
    return next(error);
  }

  next();
};

module.exports = { validateCreateTodo, validateUpdateTodo };