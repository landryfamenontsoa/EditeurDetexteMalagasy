import React from 'react';
import {
    Drawer,
    Box,
    Tabs,
    Tab,
    IconButton,
    Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { Icon } from '@iconify/react';
import { motion, AnimatePresence } from 'framer-motion';
import useEditorStore from '../../store/editorStore';
import SuggestionsPanel from './SuggestionsPanel';
import StatisticsPanel from './StatisticsPanel';

const Sidebar = () => {
    const { isSidebarOpen, toggleSidebar, activeTab, setActiveTab } = useEditorStore();

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Drawer
            anchor="right"
            open={isSidebarOpen}
            variant="persistent"
            sx={{
                width: 320,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 320,
                    boxSizing: 'border-box',
                    position: 'relative',
                    height: '100%',
                },
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Header */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        borderBottom: 1,
                        borderColor: 'divider',
                    }}
                >
                    <Typography variant="h6">Assistants</Typography>
                    <IconButton onClick={toggleSidebar} size="small">
                        <Close />
                    </IconButton>
                </Box>

                {/* Tabs */}
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab
                        label="Suggestions"
                        value="suggestions"
                        icon={<Icon icon="mdi:lightbulb-outline" />}
                        iconPosition="start"
                    />
                    <Tab
                        label="Statistiques"
                        value="statistics"
                        icon={<Icon icon="mdi:chart-bar" />}
                        iconPosition="start"
                    />
                </Tabs>

                {/* Content */}
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                    <AnimatePresence mode="wait">
                        {activeTab === 'suggestions' && (
                            <motion.div
                                key="suggestions"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <SuggestionsPanel />
                            </motion.div>
                        )}

                        {activeTab === 'statistics' && (
                            <motion.div
                                key="statistics"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <StatisticsPanel />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Box>
            </Box>
        </Drawer>
    );
};

export default Sidebar;