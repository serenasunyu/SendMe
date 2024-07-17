import React, { useState, useEffect } from 'react';
import { Container, Paper, Typography, TextField, Button, Box, IconButton } from '@mui/material';
import { WbSunny, NightsStay, Settings, Upload, Send } from '@mui/icons-material';
import MessageItem from './MessageItem';
import { fetchMessages, sendMessage } from '../services/api';
import { Message } from '../types';

interface SendMeProps {
  colorMode: {
    toggleColorMode: () => void;
    mode: 'light' | 'dark';
  };
}

const SendMe: React.FC<SendMeProps> = ({ colorMode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    fetchMessagesData();
  }, []);

  const fetchMessagesData = async () => {
    try {
      const fetchedMessages = await fetchMessages();
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSend = async () => {
    if (inputText || files.length > 0) {
      try {
        const formData = new FormData();
        formData.append('content', inputText);
        files.forEach((file) => formData.append('files', file));

        const newMessage = await sendMessage(formData);
        setMessages([newMessage, ...messages]);
        setInputText('');
        setFiles([]);
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    }
  };

  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles) {
      setFiles([...files, ...Array.from(uploadedFiles)]);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 2, p: 2, backgroundColor: 'background.paper' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" component="h1">SendMe</Typography>
          <Box>
            <IconButton onClick={colorMode.toggleColorMode} color="inherit" sx={{ mr: 1 }}>
              {colorMode.mode === 'dark' ? <WbSunny /> : <NightsStay />}
            </IconButton>
            <IconButton>
              <Settings />
            </IconButton>
          </Box>
        </Box>

        <TextField
          fullWidth
          multiline
          rows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Input text or paste images here... Press Cmd/Ctrl + Enter to send"
          variant="outlined"
          sx={{ mb: 2 }}
        />

        <Box display="flex" justifyContent="space-between" mb={2}>
          <Button
            variant="text"
            startIcon={<Upload />}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            Upload
          </Button>

          <input
            id="file-input"
            type="file"
            multiple
            onChange={handleUpload}
            style={{ display: 'none' }}
          />
          
          <Button variant="contained" endIcon={<Send />} onClick={handleSend}>
            Send
          </Button>
        </Box>

        {files.length > 0 && (
          <Box mb={2}>
            <Typography variant="subtitle1">Selected Files:</Typography>
            {files.map((file, index) => (
              <Typography key={index} variant="body2">{file.name}</Typography>
            ))}
          </Box>
        )}

        <Box>
          {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default SendMe;