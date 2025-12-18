import { Box, Typography, Button, useTheme } from '@mui/material';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                p: 3
            }}
        >
            <Icon icon="solar:ghost-bold-duotone" width={200} color={theme.palette.primary.main} />
            <Typography variant="h1" fontWeight="bold" sx={{ mt: 4, fontSize: { xs: '4rem', md: '6rem' } }}>
                404
            </Typography>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Page non trouvée
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mb: 4 }}>
                Désolé, la page que vous recherchez n'existe pas ou a été déplacée. Veuillez vérifier l'URL ou retourner à l'accueil.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" size="large" startIcon={<Icon icon="solar:home-2-bold" />} onClick={() => navigate('/dashboard')}>
                    Retour à l'accueil
                </Button>
                <Button variant="outlined" size="large" startIcon={<Icon icon="solar:arrow-left-bold" />} onClick={() => navigate(-1)}>
                    Page précédente
                </Button>
            </Box>
        </Box>
    );
};

export default NotFoundPage;