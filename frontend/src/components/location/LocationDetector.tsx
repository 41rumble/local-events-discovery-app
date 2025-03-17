import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  CircularProgress,
  Snackbar,
  Alert,
  Grid
} from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import SearchIcon from '@mui/icons-material/Search';
import { useLocation } from '../../contexts/LocationContext';
import { geocodeAddress } from '../../services/api';

const LocationDetector: React.FC = () => {
  const { userLocation, isLoading, error, detectCurrentLocation, setManualLocation } = useLocation();
  const [address, setAddress] = useState<string>('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  // Handle address search
  const handleAddressSearch = async () => {
    if (!address.trim()) {
      setSearchError('Please enter an address');
      return;
    }

    try {
      const response = await geocodeAddress(address);
      
      if (response.success && response.data) {
        const { latitude, longitude } = response.data;
        await setManualLocation(latitude, longitude);
        setShowSuccess(true);
        setSearchError(null);
      } else {
        setSearchError('Could not find location. Please try a different address.');
      }
    } catch (error) {
      setSearchError('Error searching for address. Please try again.');
      console.error('Error searching for address:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Your Location
      </Typography>
      
      {userLocation && (
        <Box mb={2}>
          <Typography variant="body1">
            <strong>Current Location:</strong> {userLocation.address || `${userLocation.latitude.toFixed(4)}, ${userLocation.longitude.toFixed(4)}`}
          </Typography>
        </Box>
      )}
      
      <Grid container spacing={2}>
        <Grid item xs={12} sm={8}>
          <TextField
            fullWidth
            label="Enter address or place"
            variant="outlined"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            error={!!searchError}
            helperText={searchError}
            disabled={isLoading}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddressSearch();
              }
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            startIcon={<SearchIcon />}
            onClick={handleAddressSearch}
            disabled={isLoading}
            sx={{ height: '56px' }}
          >
            Search
          </Button>
        </Grid>
      </Grid>
      
      <Box mt={2}>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={isLoading ? <CircularProgress size={20} /> : <MyLocationIcon />}
          onClick={detectCurrentLocation}
          disabled={isLoading}
        >
          {isLoading ? 'Detecting...' : 'Use My Current Location'}
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
      
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowSuccess(false)} severity="success">
          Location updated successfully!
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default LocationDetector;