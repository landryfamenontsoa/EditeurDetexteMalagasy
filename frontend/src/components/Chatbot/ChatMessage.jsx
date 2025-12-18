import React from 'react';
import {
    ListItem,
    Paper,
    Typography,
    Avatar,
    Box,
} from '@mui/material';
import { SmartToy, Person } from '@mui/icons-material';
import { motion } from 'framer-motion';

const ChatMessage = ({ message }) => {
    const isBot = message.type === 'bot';

    return (
        <ListItem
            component={motion.div}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{
                justifyContent: isBot ? 'flex-start' : 'flex-end',
                mb: 1,
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                    maxWidth: '70%',
                    flexDirection: isBot ? 'row' : 'row-reverse',
                }}
            >
                <Avatar
                    sx={{
                        width: 32,
                        height: 32,
                        bgcolor: isBot ? 'primary.main' : 'secondary.main',
                    }}
                >
                    {isBot ? <SmartToy fontSize="small" /> : <Person fontSize="small" />}
                </Avatar>

                <Paper
                    sx={{
                        p: 2,
                        bgcolor: isBot ? 'white' : 'primary.main',
                        color: isBot ? 'text.primary' : 'white',
                        borderRadius: 2,
                        borderTopLeftRadius: isBot ? 0 : 16,
                        borderTopRightRadius: isBot ? 16 : 0,
                    }}
                >
                    <Typography variant="body2">{message.text}</Typography>
                    <Typography
                        variant="caption"
                        sx={{
                            display: 'block',
                            mt: 0.5,
                            opacity: 0.7,
                        }}
                    >
                        {message.timestamp.toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </Typography>
                </Paper>
            </Box>
        </ListItem>
    );
};

export default ChatMessage;