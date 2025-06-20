import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Container,
  Alert,
  Card,
  CardContent,
  CardActions,
  Divider
} from '@mui/material';
import { LocationOn, Event as EventIcon, ConfirmationNumber, AttachMoney } from '@mui/icons-material';
import useEventPolling from '../hooks/useEventPolling';
import api from '../services/api';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { event, loading, error } = useEventPolling(id || '');
  const navigate = useNavigate();
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    console.log('[EventDetail] Mounted with ID:', id);
    console.log('[EventDetail] Current event data:', event);
  }, [id, event]);

  const handleConfirmBooking = async () => {
    if (!id) return;

    setIsBooking(true);
    try {
      await api.post(`/events/${id}/book`);
      alert('Booking successful!');
      navigate('/');
    } catch (error: any) {
      console.error('[EventDetail] Booking error:', error);
      alert(error.response?.data?.message || 'Booking failed');
    } finally {
      setIsBooking(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return isNaN(date.getTime()) ? 'Date not available' : date.toLocaleString();
    } catch {
      return 'Date not available';
    }
  };

  const availableSeats = (event?.totalSeats || 0) - (event?.bookedSeats || 0);
  const isSoldOut = availableSeats <= 0;

  if (loading) {
    return (
      <Box textAlign="center" mt={6}>
        <CircularProgress />
        <Typography variant="body1" mt={2}>Loading event details...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Alert severity="warning">Event not found</Alert>
        <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Card elevation={6} sx={{ borderRadius: 3, background: 'linear-gradient(to bottom right, #f5f7fa, #c3cfe2)' }}>
        <CardContent>
          
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {event.name || 'Event name not available'}
          </Typography>

          <Typography variant="body1" color="text.secondary" mb={2}>
            {event.description || 'No description available'}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" alignItems="center" mb={1}>
            <LocationOn fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">
              {event.location || 'Location not specified'}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" mb={1}>
            <EventIcon fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">
              {formatDate(event.date)}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center" mb={1}>
            <ConfirmationNumber fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">
              {event.bookedSeats || 0}/{event.totalSeats || 0} seats booked {isSoldOut && '(Sold Out)'}
            </Typography>
          </Box>

          <Box display="flex" alignItems="center">
            <AttachMoney fontSize="small" sx={{ mr: 1 }} />
            <Typography variant="body2">
              {typeof event.price === 'number' ? `$${event.price.toFixed(2)}` : 'Free'}
            </Typography>
          </Box>
        </CardContent>

        <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/')}>
            Back to Events
          </Button>
          <Button
            variant="contained"
            onClick={handleConfirmBooking}
            disabled={isBooking || isSoldOut || !event._id}
            sx={{ minWidth: 160 }}
          >
            {isBooking ? <CircularProgress size={22} color="inherit" /> : isSoldOut ? 'Sold Out' : 'Confirm Booking'}
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

export default EventDetail;
