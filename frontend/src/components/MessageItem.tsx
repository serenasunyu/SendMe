import React from 'react';
import { Card, CardContent, Typography, Box, IconButton, CardMedia } from '@mui/material';
import { FileCopy, GetApp } from '@mui/icons-material';
import { format } from 'date-fns';
import { Message } from '../types';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const formatDate = (date: string) => {
    return format(new Date(date), 'yyyy/MM/dd HH:mm:ss');
  };

  return (
    <Card sx={{ mb: 2, backgroundColor: 'background.paper' }}>
      <CardContent>
        <Typography variant="caption" color="text.secondary">
          {formatDate(message.timestamp)}
        </Typography>
        {message.type === 'text' ? (
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body1">{message.content}</Typography>
            <IconButton size="small" color="primary">
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
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>{file.name}</Typography>
                </Box>
                <Box>
                  <IconButton size="small" color="primary" sx={{ mr: 1 }}>
                    <FileCopy fontSize="small" />
                  </IconButton>
                  <IconButton size="small" color="primary" component="a" href={`http://localhost:5242${file.url}`} download>
                    <GetApp fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default MessageItem;