export interface IEvent {
  _id: string;
  name: string;
  date: string;
  location: string;
  bookedSeats: number;
  totalSeats: number;
  price?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  image?: string;
}