import React, { ReactNode, useState } from 'react';
import { Box, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blue
    },
    secondary: {
      main: '#ff9800', // Orange
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [currentView, setCurrentView] = useState<'timeline' | 'map'>('timeline');
  
  // Handle view change
  const handleViewChange = (view: 'timeline' | 'map') => {
    setCurrentView(view);
    
    // Dispatch custom event for view change
    window.dispatchEvent(new CustomEvent('viewChange', { detail: { view } }));
  };
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Header onViewChange={handleViewChange} currentView={currentView} />
        <Container component="main" maxWidth="lg" sx={{ mt: 4, mb: 4, flex: 1 }}>
          {children}
        </Container>
        <Footer />
      </Box>
    </ThemeProvider>
  );
};

export default Layout;