import React, { useState } from 'react';
import { Card, CardContent, Typography, Box, IconButton, CardMedia, Snackbar } from '@mui/material';
import { FileCopy, GetApp } from '@mui/icons-material';
import { format } from 'date-fns';
import { Message } from '../types';
import axios from 'axios';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const formatDate = (date: string) => {
    return format(new Date(date), 'yyyy/MM/dd HH:mm:ss');
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setSnackbarMessage('Text copied to clipboard');
        setSnackbarOpen(true);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        setSnackbarMessage('Failed to copy text');
        setSnackbarOpen(true);
      });
  };

  const handleCopyFileUrl = (url: string) => {
    const fullUrl = `http://localhost:5242${url}`;
    navigator.clipboard.writeText(fullUrl)
      .then(() => {
        setSnackbarMessage('File URL copied to clipboard');
        setSnackbarOpen(true);
      })
      .catch(err => {
        console.error('Failed to copy file URL: ', err);
        setSnackbarMessage('Failed to copy file URL');
        setSnackbarOpen(true);
      });
  };

  const handleDownload = async (fileId: string, filename: string) => {
    try {
      const response = await axios.get(`http://localhost:5242/api/Messages/download/${fileId}`, {
        responseType: 'blob',
        withCredentials: true,
      });
  
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
  
      setSnackbarMessage('File downloaded successfully');
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Download failed:', error);
      setSnackbarMessage('Failed to download file');
      setSnackbarOpen(true);
    }
  };
  

  return (
    <>
      <Card sx={{ mb: 2, backgroundColor: 'background.paper' }}>
        <CardContent>
          <Typography variant="caption" color="text.secondary">
            {formatDate(message.timestamp)}
          </Typography>
          {message.type === 'text' ? (
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body1">{message.content}</Typography>
              <IconButton 
                size="small" 
                color="primary" 
                onClick={() => handleCopyText(message.content)}
              >
                <FileCopy fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Box>
              {message.files.map((file, index) => (
                <Box key={index} display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                  <Box display="flex" alignItems="center">
                    <CardMedia
                      component="img"
                      sx={{ width: 50, height: 50, mr: 1 }}
                      image={`http://localhost:5242${file.url}`}
                      alt={file.name}
                    />
                    <Typography variant="body2" sx={{ flexGrow: 1, ml: 4 }}>{file.name}</Typography>
                  </Box>
                  <Box>
                    <IconButton 
                      size="small" 
                      color="primary" 
                      sx={{ mr: 1 }}
                      onClick={() => handleCopyFileUrl(file.url)}
                    >
                      <FileCopy fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="primary" 
                      onClick={() => handleDownload(file.id, file.name)}
                    >
                      <GetApp fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        sx={{
            bottom: '20%',
            transform: 'translateY(-50%)',
        }}
      />
    </>
  );
};

export default MessageItem;