import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, TextField, Button, Paper, Container, useTheme } from '@mui/material';
import { Settings, Upload, Send, WbSunny, NightsStay } from '@mui/icons-material';
import { Message, File } from '../types/types';
import { MessageItem } from './MessageItem';
import { fetchMessages, sendTextMessage, uploadImage } from '../services/api';

interface ColorMode {
    toggleColorMode: () => void;
}

interface SendMeProps {
    colorMode: ColorMode;
}

export const SendMe: React.FC<SendMeProps> = ({ colorMode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const theme = useTheme();

  useEffect(() => {
    fetchMessagesData();
  }, []);

  const fetchMessagesData = async () => {
    try {
      const fetchedMessages = await fetchMessages();
      setMessages(fetchedMessages);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      // Optionally, you can still use fakeMessages as a fallback
      // setMessages(fakeMessages);
    }
  };

  const handleSend = async () => {
    if (inputText || files.length > 0) {
      try {
        let newMessage: Message;
        if (files.length > 0) {
          newMessage = await uploadImage(files);
        } else {
          newMessage = await sendTextMessage(inputText);
        }
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
      const newFiles: File[] = Array.from(uploadedFiles).map(file => ({
        name: file.name,
        url: URL.createObjectURL(file)
      }));
      setFiles([...files, ...newFiles]);
    }
  };

  return (
    <Container maxWidth='sm'>
        <Paper elevation={3} sx={{mt:2, p:2, backgroundColor:'background.paper' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant='h6' component="h1">SendMe</Typography>
                <Box>
                    <IconButton onClick={colorMode.toggleColorMode} color="inherit" sx={{ mr: 1 }}>
                        {theme.palette.mode === 'dark' ? <WbSunny /> : <NightsStay />}
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
                placeholder="Input text or paste images here ... Press Cmd/Ctrl + Enter to send"
                variant="outlined"
                sx={{mb: 2 }}
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
                    style={{display: 'none' }}
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