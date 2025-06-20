const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  
  name: {
    type: String,
    required: [true, 'Please add an event name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  date: {
    type: Date,
    required: [true, 'Please add an event date'],
    min: [Date.now, 'Event date must be in the future']
  },
  location: {
    type: String,
    required: [true, 'Please add a location']
  },
  totalSeats: {
    type: Number,
    required: [true, 'Please specify total seats'],
    min: [1, 'There must be at least 1 seat']
  },
  bookedSeats: {
    type: Number,
    default: 0,
    validate: {
      validator: function(val) {
        return val <= this.totalSeats;
      },
      message: 'Booked seats cannot exceed total seats'
    }
  },
  price: {
    type: Number,
    required: [true, 'Please specify a price'],
    min: [0, 'Price cannot be negative']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent overbooking when saving
// models/Event.js
// Add this to your schema
EventSchema.pre('findOneAndUpdate', function(next) {
  this.options.runValidators = true;
  next();
});
module.exports = mongoose.model('Event', EventSchema);