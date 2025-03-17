import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Box, 
  Menu, 
  MenuItem,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ViewListIcon from '@mui/icons-material/ViewList';
import MapIcon from '@mui/icons-material/Map';
import NotificationsIcon from '@mui/icons-material/Notifications';

interface HeaderProps {
  onViewChange: (view: 'timeline' | 'map') => void;
  currentView: 'timeline' | 'map';
}

const Header: React.FC<HeaderProps> = ({ onViewChange, currentView }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);
  
  // Handle mobile menu open
  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };
  
  // Handle mobile menu close
  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };
  
  // Handle view change
  const handleViewChange = (view: 'timeline' | 'map') => {
    onViewChange(view);
    handleMobileMenuClose();
  };
  
  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Local Events
        </Typography>
        
        {isMobile ? (
          <>
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={handleMobileMenuOpen}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={mobileMenuAnchor}
              open={Boolean(mobileMenuAnchor)}
              onClose={handleMobileMenuClose}
            >
              <MenuItem 
                onClick={() => handleViewChange('timeline')}
                selected={currentView === 'timeline'}
              >
                <ViewListIcon sx={{ mr: 1 }} />
                Timeline View
              </MenuItem>
              <MenuItem 
                onClick={() => handleViewChange('map')}
                selected={currentView === 'map'}
              >
                <MapIcon sx={{ mr: 1 }} />
                Map View
              </MenuItem>
            </Menu>
          </>
        ) : (
          <Box>
            <Button 
              color="inherit" 
              startIcon={<ViewListIcon />}
              onClick={() => handleViewChange('timeline')}
              variant={currentView === 'timeline' ? 'outlined' : 'text'}
              sx={{ mr: 1 }}
            >
              Timeline
            </Button>
            <Button 
              color="inherit" 
              startIcon={<MapIcon />}
              onClick={() => handleViewChange('map')}
              variant={currentView === 'map' ? 'outlined' : 'text'}
            >
              Map
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;