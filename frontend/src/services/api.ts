import { Message, File } from "../types/types";

const API_URL = 'http://localhost:5242';

export const fetchMessages = async (): Promise<Message[]> => {
  const response = await fetch(`${API_URL}/messages`);
  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }
  const messages: Message[] = await response.json();
  return messages.map(message => ({
    ...message,
    timestamp: new Date(message.timestamp)
  }));
};

export const sendTextMessage = async (content: string): Promise<Message> => {
  const response = await fetch(`${API_URL}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content, type: 'text' }),
  });
  if (!response.ok) {
    throw new Error('Failed to send message');
  }
  const message: Message = await response.json();
  return {
    ...message,
    timestamp: new Date(message.timestamp)
  };
};

export const uploadImage = async (files: File[]): Promise<Message> => {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`file${index}`, file.url);
  });

  const response = await fetch(`${API_URL}/messages/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to upload image');
  }
  const message: Message = await response.json();
  return {
    ...message,
    timestamp: new Date(message.timestamp)
  };
};