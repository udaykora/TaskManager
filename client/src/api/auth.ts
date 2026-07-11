import axios from 'axios';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const API_BASE_URL = 'http://localhost:5000/api/auth';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, 
});

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  mobileNumber: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const signupUser = async (payload: SignupPayload) => {
console.log('Signup payload:', payload);
  const res = await api.post('/signup', payload);
  return res.data;
};


export const loginUser = async ({ email, password }: LoginPayload) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const idToken = await userCredential.user.getIdToken();

  const res = await api.post('/login', { idToken });
  return res.data; 
};