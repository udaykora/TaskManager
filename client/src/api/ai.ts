import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/ai',
  withCredentials: true,
});

export interface AISuggestion {
  description: string;
  priority: 'Low' | 'Medium' | 'High';
}

export const getAISuggestion = async (title: string): Promise<AISuggestion> => {
  const res = await api.post('/suggest', { title });
  return res.data;
};