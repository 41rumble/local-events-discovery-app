import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActionArea,
  Chip,
  Divider,
  Grid,
  Pagination,
  CircularProgress,
  Alert
} from '@mui/material';
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

// Group events by date
const groupEventsByDate = (events: Event[]): Record<string, Event[]> => {
  return events.reduce((groups, event) => {
    const date = format(new Date(event.startTime), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {} as Record<string, Event[]>);
};

const EventTimeline: React.FC = () => {
  const { events, isLoading, error, setSelectedEvent, pagination, setPage } = useEvents();
  
  // Group events by date
  const eventsByDate = groupEventsByDate(events);
  const dates = Object.keys(eventsByDate).sort();

  // Handle event selection
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  // Handle pagination change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        {error}
      </Alert>
    );
  }

  if (events.length === 0) {
    return (
      <Alert severity="info" sx={{ mb: 3 }}>
        No events found for your current location and filters. Try changing your filters or location.
      </Alert>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Upcoming Events
      </Typography>

      {dates.map((date) => (
        <Box key={date} mb={4}>
          <Typography variant="h6" sx={{ mb: 2, mt: 3 }}>
            {format(new Date(date), 'EEEE, MMMM d, yyyy')}
          </Typography>
          
          <Divider sx={{ mb: 2 }} />
          
          <Grid container spacing={3}>
            {eventsByDate[date].map((event) => (
              <Grid item xs={12} sm={6} md={4} key={event._id}>
                <Card elevation={2}>
                  <CardActionArea onClick={() => handleEventClick(event)}>
                    <CardMedia
                      component="img"
                      height="140"
                      image={event.imageUrl || `https://source.unsplash.com/random/300x200?${event.eventType}`}
                      alt={event.title}
                    />
                    <CardContent>
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                        <Typography variant="h6" noWrap sx={{ maxWidth: '70%' }}>
                          {event.title}
                        </Typography>
                        <Chip 
                          label={eventTypeLabels[event.eventType]} 
                          size="small"
                          sx={{ 
                            backgroundColor: eventTypeColors[event.eventType],
                            color: 'white'
                          }} 
                        />
                      </Box>
                      
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {format(new Date(event.startTime), 'h:mm a')} - {format(new Date(event.endTime), 'h:mm a')}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {event.location.name}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }} noWrap>
                        {event.description}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      {pagination.totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={pagination.totalPages}
            page={pagination.page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Paper>
  );
};

export default EventTimeline;