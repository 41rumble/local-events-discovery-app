import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Chip,
  Divider,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LinkIcon from '@mui/icons-material/Link';
import { format } from 'date-fns';
import { Event, EventType } from '../../types';
import { useEvents } from '../../contexts/EventsContext';

// Event type to color mapping
const eventTypeColors: Record<EventType, string> = {
  movie: '#e57373',
  band: '#81c784',
  sport: '#64b5f6',
  festival: '#ffb74d',
  theater: '#ba68c8',
  art: '#4db6ac',
  community: '#9575cd'
};

// Event type to label mapping
const eventTypeLabels: Record<EventType, string> = {
  movie: 'Movie',
  band: 'Band & Music',
  sport: 'Sport',
  festival: 'Festival',
  theater: 'Theater',
  art: 'Art',
  community: 'Community'
};

const EventDetail: React.FC = () => {
  const { selectedEvent, setSelectedEvent } = useEvents();
  
  // Close event detail dialog
  const handleClose = () => {
    setSelectedEvent(null);
  };
  
  if (!selectedEvent) {
    return null;
  }
  
  return (
    <Dialog
      open={!!selectedEvent}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Typography variant="h6">{selectedEvent.title}</Typography>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              sx={{
                width: '100%',
                borderRadius: 1,
                mb: 2
              }}
              src={selectedEvent.imageUrl || `https://source.unsplash.com/random/600x400?${selectedEvent.eventType}`}
              alt={selectedEvent.title}
            />
            
            <Box display="flex" alignItems="center" mb={2}>
              <Chip 
                label={eventTypeLabels[selectedEvent.eventType]} 
                sx={{ 
                  backgroundColor: eventTypeColors[selectedEvent.eventType],
                  color: 'white'
                }} 
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                Source: {selectedEvent.source.charAt(0).toUpperCase() + selectedEvent.source.slice(1)}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box display="flex" alignItems="center" mb={2}>
              <CalendarTodayIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body1">
                {format(new Date(selectedEvent.startTime), 'EEEE, MMMM d, yyyy')}
              </Typography>
            </Box>
            
            <Box display="flex" alignItems="center" mb={2}>
              <AccessTimeIcon color="primary" sx={{ mr: 1 }} />
              <Typography variant="body1">
                {format(new Date(selectedEvent.startTime), 'h:mm a')} - {format(new Date(selectedEvent.endTime), 'h:mm a')}
              </Typography>
            </Box>
            
            <Box display="flex" mb={2}>
              <LocationOnIcon color="primary" sx={{ mr: 1, mt: 0.5 }} />
              <Box>
                <Typography variant="body1">
                  {selectedEvent.location.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedEvent.location.address}
                </Typography>
              </Box>
            </Box>
            
            {selectedEvent.bookingLink && (
              <Button
                variant="contained"
                color="primary"
                startIcon={<LinkIcon />}
                href={selectedEvent.bookingLink}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ mt: 2 }}
              >
                Book Tickets
              </Button>
            )}
          </Grid>
          
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" paragraph>
              {selectedEvent.description}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDetail;