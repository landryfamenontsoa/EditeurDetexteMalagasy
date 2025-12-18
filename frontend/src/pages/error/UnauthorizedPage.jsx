import { Box, Typography, Button, useTheme } from '@mui/material';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
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
            <Icon icon="solar:lock-password-unlocked-bold-duotone" width={200} color={theme.palette.error.main} />
            <Typography variant="h1" fontWeight="bold" sx={{ mt: 4, fontSize: { xs: '4rem', md: '6rem' } }}>
                403
            </Typography>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Accès non autorisé
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 500, mb: 4 }}>
                Vous n'avez pas les permissions nécessaires pour accéder à cette page. Veuillez contacter l'administrateur si vous pensez qu'il s'agit d'une erreur.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" size="large" startIcon={<Icon icon="solar:home-2-bold" />} onClick={() => navigate('/dashboard')}>
                    Retour à l'accueil
                </Button>
                <Button variant="outlined" size="large" startIcon={<Icon icon="solar:letter-bold" />}>
                    Contacter le support
                </Button>
            </Box>
        </Box>
    );
};

export default UnauthorizedPage;