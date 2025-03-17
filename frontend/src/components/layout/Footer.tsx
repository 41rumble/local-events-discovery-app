import React from 'react';
import { Box, Typography, Container, Link } from '@mui/material';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100]
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} Local Events App
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          Powered by Eventbrite, Ticketmaster, and Meetup
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;