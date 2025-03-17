import React, { useState } from 'react';
import { 
  Box, 
  Chip, 
  Typography, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  OutlinedInput, 
  SelectChangeEvent,
  Button,
  Grid,
  TextField
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import { EventType, EventFilters as EventFiltersType } from '../../types';
import { useEvents } from '../../contexts/EventsContext';

const eventTypeOptions: { value: EventType; label: string; color: string }[] = [
  { value: 'movie', label: 'Movies', color: '#e57373' },
  { value: 'band', label: 'Bands & Music', color: '#81c784' },
  { value: 'sport', label: 'Sports', color: '#64b5f6' },
  { value: 'festival', label: 'Festivals', color: '#ffb74d' },
  { value: 'theater', label: 'Theater', color: '#ba68c8' },
  { value: 'art', label: 'Art', color: '#4db6ac' },
  { value: 'community', label: 'Community', color: '#9575cd' }
];

const EventFilters: React.FC = () => {
  const { filters, setFilters, refreshEventsData, isLoading } = useEvents();
  
  // Local state for form values
  const [selectedTypes, setSelectedTypes] = useState<EventType[]>(filters.eventTypes || []);
  const [startDate, setStartDate] = useState<Date | null>(filters.startDate || null);
  const [endDate, setEndDate] = useState<Date | null>(filters.endDate || null);

  // Handle event type selection
  const handleEventTypeChange = (event: SelectChangeEvent<EventType[]>) => {
    const value = event.target.value as EventType[];
    setSelectedTypes(value);
  };

  // Apply filters
  const applyFilters = () => {
    setFilters({
      eventTypes: selectedTypes,
      startDate: startDate || undefined,
      endDate: endDate || undefined
    });
  };

  // Reset filters
  const resetFilters = () => {
    setSelectedTypes([]);
    setStartDate(null);
    setEndDate(null);
    setFilters({});
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          <FilterListIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Filter Events
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<RefreshIcon />}
          onClick={refreshEventsData}
          disabled={isLoading}
        >
          {isLoading ? 'Refreshing...' : 'Refresh Events'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="event-type-label">Event Types</InputLabel>
            <Select
              labelId="event-type-label"
              id="event-type-select"
              multiple
              value={selectedTypes}
              onChange={handleEventTypeChange}
              input={<OutlinedInput label="Event Types" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {(selected as EventType[]).map((value) => {
                    const option = eventTypeOptions.find(opt => opt.value === value);
                    return (
                      <Chip 
                        key={value} 
                        label={option?.label || value} 
                        sx={{ backgroundColor: option?.color, color: 'white' }}
                      />
                    );
                  })}
                </Box>
              )}
            >
              {eventTypeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                />
              </Grid>
              <Grid item xs={6}>
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  slotProps={{ textField: { fullWidth: true } }}
                  minDate={startDate || undefined}
                />
              </Grid>
            </Grid>
          </LocalizationProvider>
        </Grid>
      </Grid>

      <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
        <Button variant="outlined" onClick={resetFilters}>
          Reset Filters
        </Button>
        <Button variant="contained" color="primary" onClick={applyFilters}>
          Apply Filters
        </Button>
      </Box>
    </Paper>
  );
};

export default EventFilters;