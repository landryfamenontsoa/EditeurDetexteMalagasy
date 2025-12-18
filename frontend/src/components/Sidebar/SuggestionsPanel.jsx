import React from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Typography,
    Chip,
    Paper,
    Divider,
} from '@mui/material';
import {
    Lightbulb,
    Psychology,
    Translate,
    AutoAwesome,
} from '@mui/icons-material';
import { Icon } from '@iconify/react';
import useEditorStore from '../../store/editorStore';

const SuggestionsPanel = () => {
    const { suggestions, sentimentScore, entities } = useEditorStore();

    return (
        <Box sx={{ p: 2 }}>
            {/* Analyse de sentiment */}
            {sentimentScore && (
                <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Psychology sx={{ mr: 1, color: 'primary.main' }} />
                        <Typography variant="subtitle2">Sentiment du texte</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip
                            label={sentimentScore.label}
                            color={sentimentScore.score > 0 ? 'success' : 'error'}
                            size="small"
                        />
                        <Typography variant="caption" color="text.secondary">
                            Score: {sentimentScore.score.toFixed(2)}
                        </Typography>
                    </Box>
                </Paper>
            )}

            {/* Entités nommées */}
            {entities && entities.length > 0 && (
                <Paper sx={{ p: 2, mb: 2, bgcolor: 'background.default' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Icon icon="mdi:tag-multiple" width="20" style={{ marginRight: 8, color: '#1976d2' }} />
                        <Typography variant="subtitle2">Entités détectées</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {entities.map((entity, index) => (
                            <Chip
                                key={index}
                                label={entity.text}
                                size="small"
                                variant="outlined"
                                color={
                                    entity.type === 'PERSON' ? 'primary' :
                                        entity.type === 'PLACE' ? 'success' :
                                            'secondary'
                                }
                            />
                        ))}
                    </Box>
                </Paper>
            )}

            {/* Suggestions sémantiques */}
            <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <AutoAwesome sx={{ mr: 1, fontSize: 20 }} />
                Suggestions
            </Typography>

            <List dense>
                {suggestions && suggestions.length > 0 ? (
                    suggestions.map((suggestion, index) => (
                        <ListItem key={index} disablePadding>
                            <ListItemButton>
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    <Lightbulb fontSize="small" color="warning" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={suggestion.word}
                                    secondary={suggestion.definition}
                                    primaryTypographyProps={{ variant: 'body2' }}
                                    secondaryTypographyProps={{ variant: 'caption' }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))
                ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
                        Aucune suggestion pour le moment
                    </Typography>
                )}
            </List>
        </Box>
    );
};

export default SuggestionsPanel;