# Tourist Management System

A full-stack web application for managing tourist bookings with Flask backend and React frontend.

<img width="1919" height="972" alt="image" src="https://github.com/user-attachments/assets/fb07c416-1d55-4965-8859-977a011229d9" />
<img width="1919" height="970" alt="image" src="https://github.com/user-attachments/assets/a6fd7d66-8ee7-4998-b3e0-ec9c35e8c35e" />
<img width="961" height="900" alt="image" src="https://github.com/user-attachments/assets/08c3b7f9-ad7b-4aa7-b0f9-4e04c3ae3fee" />
<img width="436" height="732" alt="image" src="https://github.com/user-attachments/assets/d4311a64-e831-4ab3-8e5f-d2f2c6743f66" />
<img width="616" height="923" alt="image" src="https://github.com/user-attachments/assets/37fdec0d-dbcb-46ba-b6f0-4c0054193aa0" />
<img width="1128" height="877" alt="image" src="https://github.com/user-attachments/assets/948d9e5f-4931-4f43-ae54-f4fd6ed58b89" />
<img width="787" height="849" alt="image" src="https://github.com/user-attachments/assets/b8f8afe0-377e-4858-b1a2-a574e11c561a" />
<img width="791" height="680" alt="image" src="https://github.com/user-attachments/assets/cff697d2-0cde-4529-98eb-a7aa16a7201a" />
<img width="1326" height="683" alt="image" src="https://github.com/user-attachments/assets/70d89a26-8766-494f-b1aa-d8686b136b44" />
<img width="811" height="391" alt="image" src="https://github.com/user-attachments/assets/18cbd931-8fe2-44b1-9444-c19558edf774" />

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
