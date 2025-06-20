# 🎟️ Event Booking Platform – Fullstack Developer Assignment

A full-stack web application that allows users to book seats for events in real-time, and provides admins with analytics and management tools. Built for the Powersmy.biz Fullstack Developer Internship assignment.

---

## 🚀 Tech Stack

- **Frontend:** React.js + TypeScript + Material UI
- **Backend:** Node.js + Express.js + MongoDB
- **Auth:** JWT-based with bcrypt password hashing
- **Concurrency:** Atomic seat booking logic using MongoDB
- **Deployment:** Render / Railway (Docker-ready)
- **Other:** Nodemailer, QR Code generator, Docker, Postman

---

## 🌐 Live Demo

🔗 [Deployed Link Here](https://your-deployment-url.com)  
📂 [GitHub Repo](https://github.com/bilaltambolialt/event-booking-platform)

---

## 🧑‍💻 User Roles

### 👤 Users
- Register & login
- View events
- Book available seats (real-time)
- View their own bookings

### 🛠️ Admins
- Create, edit, delete events
- View analytics dashboard
- See total seats booked & occupancy stats

---

## 📊 Admin Analytics Endpoint

`GET /api/admin/analytics` returns:
- Total events
- Total seats booked
- Seats booked per event
- % occupancy per event

---

## 📦 Folder Structure

event-booking-platform/
├── client/ # React frontend
├── server/ # Express backend
├── docker-compose.yml # Run full stack with Docker
└── README.md
yaml
Copy
Edit

## ⚙️ Local Setup (Dev)

```bash
# 1. Clone the repo
git clone https://github.com/bilaltambolialt/event-booking-platform.git
cd event-booking-platform

# 2. Setup backend
cd server
npm install
cp .env.example .env
npm run dev

# 3. Setup frontend
cd ../client
npm install
npm start
🐳 Docker Setup (Production or Deployment)
bash
Copy
Edit
# From the root of the project
docker-compose up --build
Then open: http://localhost:3000

🔐 Environment Variables
server/.env.example
ini
Copy
Edit
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_password
✅ Features Completed
 Authentication with JWT & bcrypt

 Role-based access (Admin & User)

 Event creation/edit/deletion (Admin)

 Real-time seat booking with concurrency handling

 Admin analytics

 Email confirmations (bonus)

 QR Code generation (bonus)

 Custom polling hook (bonus)

 Dockerized frontend & backend

 Deployed project (Render/Railway)

🧪 Postman Collection
📁 Included in /Postman/assignment-collection.json

✍️ Assumptions
One seat is booked per API call

Seats cannot be overbooked due to atomic operations

Admin access is assumed to be managed manually or seeded

🤝 Acknowledgments
This project was built as part of the Fullstack Developer Internship assignment for Powersmy.biz
Author: Bilal Tamboli
