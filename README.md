# Tourist Management System

A full-stack web application for managing tourist bookings with Flask backend and React frontend.

## Features

- 🔐 User Authentication (OTP-based registration)
- 🏖️ Browse tourist destinations
- 📦 Package filtering and booking
- 📧 Email confirmation for bookings
- 👨‍💼 Admin dashboard for managing tours
- 📊 Booking history and management

## Tech Stack

Backend:
- Python Flask
- PostgreSQL
- Flask-SQLAlchemy
- Flask-Login
- Flask-Bcrypt

Frontend:
- React.js
- React Router
- CSS3

## Installation

### Backend Setup

1. Clone repository:
```bash
git clone https://github.com/mani7204mani/tourist-management-system.git
cd tourist-management-system
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Create `.env` file:
```env
DATABASE_URL=your_postgresql_connection_string
SECRET_KEY=your_secret_key
EMAIL_ADDRESS=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

4. Run backend:
```bash
python app.py
```

### Frontend Setup

1. Navigate to frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000
```

4. Run frontend:
```bash
npm start
```

## Deployment

- Backend: Deployed on Vercel
- Frontend: Deployed on Vercel
- Database: Neon PostgreSQL

## Default Admin Credentials

- Username: `admin`
- Password: `admin123`

## License

MIT License

## Author

Your Name - Mani Shankar Reddy P(https://github.com/mani7204mani)
