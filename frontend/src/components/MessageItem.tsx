import React from 'react';
import { Box, Typography, IconButton, Card, CardContent, CardMedia, useTheme } from '@mui/material';
import { FileCopy, GetApp } from '@mui/icons-material';
import { Message, File } from '../types/types';

interface MessageItemProps {
    message: Message;
}

export const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
    const theme = useTheme();

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

  return (
    <Card sx={{mb: 2, backgroundColor: 'background.paper' }}>
        <CardContent>
            <Typography variant="caption" color="text.secondary">
                {formatDate(message.timestamp)}
            </Typography>
            {message.type === 'text' ? (
                <Box display="flex" justifyContent="space-between">
                    <Typography variant="body1">{message.content as string}</Typography>
                    <IconButton size="small" sx={{ color: theme.palette.primary.main }}>
                        <FileCopy fontSize="small" />
                    </IconButton>
                </Box>
            ) : (
                <Box>
                    {
                        (message.content as File[]).map((file, index) => (
                            <Box key={index} display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                                <Box display="flex" alignItems="center">
                                    <CardMedia 
                                        component="img"
                                        sx={{ width: 50, height: 50, mr: 1 }}
                                        image={file.url}
                                        alt={file.name}
                                    />
                                    <Typography variant="body2" sx={{ flexGrow: 1 }}>{file.name}</Typography>
                                </Box>

                                <Box>
                                    <IconButton size="small" sx={{ color: theme.palette.primary.main, mr: 4 }}>
                                        <FileCopy fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" sx={{ color: theme.palette.primary.main }}>
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
