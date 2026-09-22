import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

export const getTodos = async ({ search, completed } = {}) => {
  const params = {};
  if (search) params.search = search;
  if (completed !== undefined && completed !== '') params.completed = completed;

  const res = await api.get('/todos', { params });
  return res.data.data;
};

export const getTodoById = async (id) => {
  const res = await api.get(`/todos/${id}`);
  return res.data.data;
};

export const createTodo = async ({ title, description }) => {
  const res = await api.post('/todos', { title, description });
  return res.data.data;
};

export const updateTodo = async (id, updates) => {
  const res = await api.put(`/todos/${id}`, updates);
  return res.data.data;
};

export const deleteTodo = async (id) => {
  await api.delete(`/todos/${id}`);
};

export default api;