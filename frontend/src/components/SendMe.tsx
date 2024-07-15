import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, TextField, Button, Paper, Container, useTheme } from '@mui/material';
import { Settings, Upload, Send, WbSunny, NightsStay } from '@mui/icons-material';
import { Message, File } from '../types';
import { MessageItem } from './MessageItem';
import { generateId } from '../utils/helpers';
import { fakeMessages } from '../data/fakeData';


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
    // fetchMessages();
    setMessages(fakeMessages);
  }, []);

  /*
  const fetchMessages = async () => {
    // API call to fetch messages
    // setMessages(fetchedMessages);
  };
  */

  const handleSend = () => {
    if (inputText || files.length > 0) {
      const newMessage: Message = {
        id: generateId(),
        timestamp: new Date(),
        content: files.length > 0 ? files : inputText,
        type: files.length > 0 ? 'image' : 'text',
      };
      setMessages([newMessage, ...messages]);
      setInputText('');
      setFiles([]);
      // API call to send message
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

            <Box>
                {messages.map(
                    (message) => (
                        <MessageItem key={message.id} message={message} />
                    )
                )}
            </Box>
        </Paper>
    </Container>
  );
};