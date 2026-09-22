import { useState } from 'react';

const TodoForm = ({ onSubmit, onCancel, initialValues = { title: '', description: '' } }) => {
  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title.trim().length === 0) {
      setError('Title cannot be empty');
      return;
    }

    setError('');
    onSubmit({ title: title.trim(), description: description.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 border border-gray-200 rounded-lg bg-white">
      <div>
        <input
          type="text"
          placeholder="Todo title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded resize-none"
        rows={2}
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800"
        >
          Save
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TodoForm;