import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/tasks',
  withCredentials: true,
});

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  priority: 'Low' | 'Medium' | 'High';
  status: 'To Do' | 'In Progress' | 'Done';
}

export const getTasks = async (): Promise<Task[]> => {
  const res = await api.get('/');
  return res.data;
};

export const createTask = async (task: Partial<Task>) => {
  const res = await api.post('/', task);
  return res.data;
};

export const updateTask = async (id: string, task: Partial<Task>) => {
  const res = await api.put(`/${id}`, task);
  return res.data;
};

export const deleteTask = async (id: string) => {
  const res = await api.delete(`/${id}`);
  return res.data;
};