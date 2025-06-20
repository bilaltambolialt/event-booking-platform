// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  CircularProgress,
  Paper,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  IconButton,
  Tooltip
} from '@mui/material';
import { Add, Delete, Edit } from '@mui/icons-material';
import api from '../services/api';
import EventFormModal from '../components/Events/EventFormModal';
import { useAuth } from '../context/AuthContext';
import { IEvent } from '../types/event';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<IEvent | null>(null);
  const { isAdmin } = useAuth();

 const fetchEvents = async () => {
  try {
    const response = await api.get('/events');
    // Ensure we're working with an array
    const eventsData = Array.isArray(response.data) 
      ? response.data 
      : response.data.data || [];
    setEvents(eventsData);
  } catch (error: any) {
    console.error('Failed to fetch events:', error);
    toast.error(error.response?.data?.message || 'Failed to load events');
    setEvents([]); // Set to empty array on error
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = () => {
    setCurrentEvent(null);
    setOpenModal(true);
  };

  const handleEditEvent = (event: IEvent) => {
    setCurrentEvent(event);
    setOpenModal(true);
  };

  const handleDeleteEvent = async (id: string) => {
  if (!window.confirm('Are you sure you want to delete this event?')) return;
  
  try {
    const response = await api.delete(`/events/${id}`);
    
    if (response.status === 404) {
      toast.error('Event not found - it may have already been deleted');
      fetchEvents(); // Refresh the list
      return;
    }
    
    toast.success('Event deleted successfully');
    fetchEvents();
  } catch (error: any) {
    console.error('Delete error:', error);
    
    if (error.response?.status === 404) {
      toast.error('Event not found');
    } else {
      toast.error(error.response?.data?.message || 'Failed to delete event');
    }
    
    fetchEvents(); // Refresh list even if error occurs
  }
};

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentEvent(null);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          Admin Dashboard
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={handleCreateEvent}
          data-testid="create-event-button"
        >
          Create Event
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Event Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Seats</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event._id} hover>
                <TableCell>{event.name}</TableCell>
                <TableCell sx={{ maxWidth: 200 }}>
                  <Box sx={{ 
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '200px'
                  }}>
                    {event.description}
                  </Box>
                </TableCell>
                <TableCell>
                  {new Date(event.date).toLocaleString()}
                </TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>
                  {event.bookedSeats} / {event.totalSeats}
                </TableCell>
                <TableCell>
                  {event.price ? `$${event.price.toFixed(2)}` : 'Free'}
                </TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton 
                      onClick={() => handleEditEvent(event)}
                      data-testid={`edit-event-${event._id}`}
                    >
                      <Edit color="primary" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton 
                      onClick={() => handleDeleteEvent(event._id)}
                      data-testid={`delete-event-${event._id}`}
                    >
                      <Delete color="error" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <EventFormModal
        open={openModal}
        onClose={handleCloseModal}
        event={currentEvent}
        refreshEvents={fetchEvents}
      />
    </Container>
  );
};

export default Dashboard;