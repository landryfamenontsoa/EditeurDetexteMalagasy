import React, { useState } from 'react';
import {
    Drawer,
    Box,
    Typography,
    TextField,
    IconButton,
    Paper,
    Avatar,
    List,
    ListItem,
    Divider,
} from '@mui/material';
import {
    Close,
    Send,
    SmartToy,
    Person,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import useEditorStore from '../../store/editorStore';
import ChatMessage from './ChatMessage';

const ChatbotDrawer = () => {
    const { isChatbotOpen, toggleChatbot, content } = useEditorStore();
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'bot',
            text: 'Bonjour ! Je suis votre assistant d\'écriture Malagasy. Comment puis-je vous aider ?',
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = {
            id: Date.now(),
            type: 'user',
            text: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // const response = await chatbotAPI.sendMessage(input, content);

            const botMessage = {
                id: Date.now() + 1,
                type: 'bot',
                // text: response.message,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error('Chatbot error:', error);
            const errorMessage = {
                id: Date.now() + 1,
                type: 'bot',
                text: 'Désolé, une erreur s\'est produite. Veuillez réessayer.',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Drawer
            anchor="bottom"
            open={isChatbotOpen}
            onClose={toggleChatbot}
            sx={{
                '& .MuiDrawer-paper': {
                    height: '60vh',
                    maxHeight: 600,
                },
            }}
        >
            <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        borderBottom: 1,
                        borderColor: 'divider',
                        bgcolor: 'primary.main',
                        color: 'white',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <SmartToy />
                        <Typography variant="h6">Assistant Malagasy</Typography>
                    </Box>
                    <IconButton onClick={toggleChatbot} sx={{ color: 'white' }}>
                        <Close />
                    </IconButton>
                </Box>

                {/* Messages */}
                <Box
                    sx={{
                        flex: 1,
                        overflow: 'auto',
                        p: 2,
                        bgcolor: 'grey.50',
                    }}
                >
                    <List>
                        {messages.map((message) => (
                            <ChatMessage key={message.id} message={message} />
                        ))}

                        {isLoading && (
                            <ListItem>
                                <Paper
                                    sx={{
                                        p: 2,
                                        bgcolor: 'white',
                                        borderRadius: 2,
                                        maxWidth: '70%',
                                    }}
                                >
                                    <Typography variant="body2" color="text.secondary">
                                        L'assistant réfléchit...
                                    </Typography>
                                </Paper>
                            </ListItem>
                        )}
                    </List>
                </Box>

                {/* Input */}
                <Box
                    sx={{
                        p: 2,
                        borderTop: 1,
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                    }}
                >
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Posez une question..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            disabled={isLoading}
                        />
                        <IconButton
                            color="primary"
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                        >
                            <Send />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
        </Drawer>
    );
};

export default ChatbotDrawer;