import { Card, CardContent, Typography, Button, Box, } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Event {
  _id: string;
  name: string;
  date: string;
  location: string;
  bookedSeats: number;
  totalSeats: number;
  price?: number;
}

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const navigate = useNavigate();

  const availableSeats = event.totalSeats - event.bookedSeats;
  const isSoldOut = availableSeats <= 0;

  const handleBookClick = () => {
    navigate(`/events/${event._id}`);
  };

  return (
    <Card sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'scale(1.02)',
        boxShadow: 3
      }
    }}>
      
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="h2">
          {event.name}
        </Typography>
        <Typography color="text.secondary" variant="body2">
          {new Date(event.date).toLocaleString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          {event.location}
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2">
            Seats: {event.bookedSeats}/{event.totalSeats}
          </Typography>
          {event.price && (
            <Typography variant="body2" fontWeight="bold">
              ${event.price.toFixed(2)}
            </Typography>
          )}
        </Box>
      </CardContent>
      <Button
        variant="contained"
        fullWidth
        sx={{ mt: 'auto' }}
        onClick={handleBookClick}
        disabled={isSoldOut}
      >
        {isSoldOut ? 'Sold Out' : 'Book Now'}
      </Button>
    </Card>
  );
};

export default EventCard;
