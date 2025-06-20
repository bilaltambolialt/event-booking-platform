import { useEffect, useState } from 'react';
import { Box, Container, Typography } from '@mui/material';
import api from '../services/api';
import EventCard from '../components/Events/EventCard';

interface Event {
  _id: string;
  name: string;
  date: string;
  location: string;
  bookedSeats: number;
  totalSeats: number;
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    api.get('/events')
      .then(res => setEvents(res.data.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Upcoming Events</Typography>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)'
        },
        gap: 3
      }}>
        {events.map((event) => (
          <Box key={event._id}>
            <EventCard event={event} />
          </Box>
        ))}
      </Box>
    </Container>
  );
}