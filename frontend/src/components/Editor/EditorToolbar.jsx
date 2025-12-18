import React from 'react';
import {
    Paper,
    ToggleButtonGroup,
    ToggleButton,
    Divider,
    IconButton,
    Tooltip,
    Box,
} from '@mui/material';
import {
    FormatBold,
    FormatItalic,
    FormatUnderlined,
    FormatListBulleted,
    FormatListNumbered,
    VolumeUp,
    Translate,
    Psychology,
    AutoAwesome,
} from '@mui/icons-material';
import { Icon } from '@iconify/react';

const EditorToolbar = () => {
    const [formats, setFormats] = React.useState([]);

    const handleFormat = (event, newFormats) => {
        setFormats(newFormats);
    };

    return (
        <Paper
            elevation={1}
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 1,
                flexWrap: 'wrap',
            }}
        >
            {/* Formatage de texte */}
            <ToggleButtonGroup
                value={formats}
                onChange={handleFormat}
                size="small"
            >
                <ToggleButton value="bold">
                    <FormatBold fontSize="small" />
                </ToggleButton>
                <ToggleButton value="italic">
                    <FormatItalic fontSize="small" />
                </ToggleButton>
                <ToggleButton value="underlined">
                    <FormatUnderlined fontSize="small" />
                </ToggleButton>
            </ToggleButtonGroup>

            <Divider flexItem orientation="vertical" />

            {/* Listes */}
            <ToggleButtonGroup size="small">
                <ToggleButton value="bullets">
                    <FormatListBulleted fontSize="small" />
                </ToggleButton>
                <ToggleButton value="numbers">
                    <FormatListNumbered fontSize="small" />
                </ToggleButton>
            </ToggleButtonGroup>

            <Divider flexItem orientation="vertical" />

            {/* Outils IA */}
            <Tooltip title="Lire le texte">
                <IconButton size="small" color="primary">
                    <VolumeUp fontSize="small" />
                </IconButton>
            </Tooltip>

            <Tooltip title="Traduire">
                <IconButton size="small" color="primary">
                    <Translate fontSize="small" />
                </IconButton>
            </Tooltip>

            <Tooltip title="Analyser le sentiment">
                <IconButton size="small" color="primary">
                    <Psychology fontSize="small" />
                </IconButton>
            </Tooltip>

            <Tooltip title="Lemmatisation">
                <IconButton size="small" color="primary">
                    <Icon icon="mdi:book-alphabet" width="20" />
                </IconButton>
            </Tooltip>

            <Tooltip title="Suggestions sémantiques">
                <IconButton size="small" color="primary">
                    <AutoAwesome fontSize="small" />
                </IconButton>
            </Tooltip>
        </Paper>
    );
};

export default EditorToolbar;