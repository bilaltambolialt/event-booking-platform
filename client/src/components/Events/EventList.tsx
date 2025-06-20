// src/components/Events/EventList.tsx
import React from 'react';
import { IEvent } from '../../types/event'; // Add this import

interface EventListProps {
  events: IEvent[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
  return (
    <div>
      {events.map(event => (
        <div key={event._id}>{event.name}</div>
      ))}
    </div>
  );
};

export default EventList; // Must have this export