import { useEffect, useState, useCallback } from 'react';
import api from '../services/api';

interface Event {
  _id: string;
  name: string;
  description?: string;
  location?: string;
  date: string;
  bookedSeats?: number;
  totalSeats?: number;
  price?: number;
}

const useEventPolling = (eventId: string, interval = 5000) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!eventId) return;
    
    try {
      console.log(`[useEventPolling] Fetching event ${eventId}`);
      const response = await api.get(`/events/${eventId}`);
      console.log('[useEventPolling] API Response:', response.data);
      
      // Handle both response.data and response.data.data structures
      const eventData = response.data.data || response.data;
      
      if (!eventData) {
        throw new Error('Event data not found in response');
      }
      
      setEvent(eventData);
      setError(null);
    } catch (err) {
      console.error('[useEventPolling] Error:', err);
      setError('Failed to load event data');
      setEvent(null);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (!eventId) return;

    fetchData(); // Initial fetch
    const intervalId = setInterval(fetchData, interval);
    
    return () => clearInterval(intervalId);
  }, [eventId, fetchData, interval]);

  return { event, loading, error };
};

export default useEventPolling;