// src/components/Events/EventFormModal.tsx
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress
} from '@mui/material';
import { IEvent } from '../../types/event';
import api from '../../services/api';
import { toast } from 'react-toastify';

interface EventFormModalProps {
  open: boolean;
  onClose: () => void;
  event: IEvent | null;
  refreshEvents: () => void;
}

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
};

const EventFormModal: React.FC<EventFormModalProps> = ({ 
  open, 
  onClose, 
  event, 
  refreshEvents 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    totalSeats: 100,
    price: 0,
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({
    name: '',
    date: '',
    location: '',
    description: ''
  });

  useEffect(() => {
    if (open) {
      setFormData({
        name: event?.name || '',
        date: event?.date ? formatDateForInput(event.date) : '',
        location: event?.location || '',
        totalSeats: event?.totalSeats || 100,
        price: event?.price || 0,
        description: event?.description || ''
      });
    }
  }, [open, event]);

  const formatDateForInput = (dateString: string) => {
    const date = new Date(dateString);
    const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    return localDate.toISOString().slice(0, 16);
  };

  const validateForm = () => {
    const errors = {
      name: !formData.name ? 'Event name is required' : '',
      date: !formData.date ? 'Date is required' : '',
      location: !formData.location ? 'Location is required' : '',
      description: !formData.description ? 'Description is required' : ''
    };
    setFormErrors(errors);
    return Object.values(errors).every(x => x === '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        date: new Date(formData.date).toISOString(),
        location: formData.location,
        totalSeats: Number(formData.totalSeats),
        price: Number(formData.price),
        description: formData.description
      };

      if (event?._id) {
        await api.patch(`/events/${event._id}`, payload);
        toast.success('Event updated successfully');
      } else {
        await api.post('/events', payload);
        toast.success('Event created successfully');
      }

      refreshEvents();
      onClose();
    } catch (error: any) {
      console.error('Error details:', error);
      toast.error(
        error.response?.data?.message || 
        `Failed to ${event ? 'update' : 'create'} event`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          {event ? 'Edit Event' : 'Create New Event'}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              name="name"
              label="Event Name"
              value={formData.name}
              onChange={handleChange}
              error={!!formErrors.name}
              helperText={formErrors.name}
              fullWidth
              required
            />
            <TextField
              name="date"
              label="Date & Time"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={formData.date}
              onChange={handleChange}
              error={!!formErrors.date}
              helperText={formErrors.date}
              fullWidth
              required
            />
            <TextField
              name="location"
              label="Location"
              value={formData.location}
              onChange={handleChange}
              error={!!formErrors.location}
              helperText={formErrors.location}
              fullWidth
              required
            />
            <TextField
              name="totalSeats"
              label="Total Seats"
              type="number"
              value={formData.totalSeats}
              onChange={handleChange}
              fullWidth
              required
            />
            <TextField
              name="price"
              label="Price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              name="description"
              label="Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={handleChange}
              error={!!formErrors.description}
              helperText={formErrors.description}
              fullWidth
              required
            />
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth
              sx={{ mt: 2 }}
              disabled={loading}
              data-testid="submit-event-button"
            >
              {loading ? <CircularProgress size={24} /> : 
               (event ? 'Update Event' : 'Create Event')}
            </Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};

export default EventFormModal;