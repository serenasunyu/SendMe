import axios from 'axios';
import { Message } from '../types';

const API_URL = "http://localhost:5242/api";

export const fetchMessages = async (): Promise<Message[]> => {
  const response = await axios.get<Message[]>(`${API_URL}/messages`);
  return response.data;
};

export const sendMessage = async (formData: FormData): Promise<Message> => {
  const response = await axios.post<Message>(`${API_URL}/messages`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};