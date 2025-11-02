# Tourist Management System

A full-stack web application for managing tourist bookings with Flask backend and React frontend.

**Login Page for a User**
<img width="1919" height="974" alt="image" src="https://github.com/user-attachments/assets/991a12ae-e8b0-4c0f-bbda-3337be6a1a78" />

**Login Page for Admin**
<img width="1915" height="965" alt="image" src="https://github.com/user-attachments/assets/1657bc86-18d6-4e1f-956b-2e7fdddc61f3" />

**Home Page for Admin -- Special privileges for admin to add places and view User bookings.**
<img width="1919" height="919" alt="image" src="https://github.com/user-attachments/assets/aed9c760-f6a9-4b78-a184-bd6e687b181e" />

**Add a Place and manage places feature.**
<img width="792" height="880" alt="image" src="https://github.com/user-attachments/assets/505a2115-b0a6-4662-a930-3ba01d74887b" />  <img width="786" height="667" alt="image" src="https://github.com/user-attachments/assets/90e0747e-2a23-469e-a751-0b4b7b3fe28c" />

**Admin can view user bookings ,trip details and can cancel the booking**
<img width="804" height="665" alt="image" src="https://github.com/user-attachments/assets/02faeb2f-e26e-4237-b89c-da5d3cbe1b57" />  <img width="573" height="864" alt="image" src="https://github.com/user-attachments/assets/bea850bf-d150-4a33-9d1d-4a99c0735961" />

**User Places Page**
<img width="1919" height="969" alt="image" src="https://github.com/user-attachments/assets/f53efd7c-9634-49e7-8a22-f5d01d8edbae" />

**User Packages Page**
<img width="1882" height="787" alt="image" src="https://github.com/user-attachments/assets/07381315-a95e-4b7d-b0ee-b197463012dd" />


**User Booking Page and booking confirmation mail**
<img width="434" height="728" alt="image" src="https://github.com/user-attachments/assets/87ff1810-6247-4e14-881b-ab87a012bb24" />   
<img width="556" height="887" alt="image" src="https://github.com/user-attachments/assets/21f39a5a-db15-4ab3-9079-b9f6fbc5f985" />


**Contact Page for user to send his query**
<img width="1318" height="728" alt="image" src="https://github.com/user-attachments/assets/700a7fc1-4d01-4ef0-9438-378770154871" />

**User Profile and settings page where he can update username,password,gmail and phone number.**
<img width="683" height="865" alt="image" src="https://github.com/user-attachments/assets/2434b1e6-4c8e-4ada-9348-6b7a61cfb5f4" />  <img width="667" height="864" alt="image" src="https://github.com/user-attachments/assets/e5e362c2-a4e7-4e16-825b-f6d852dc60de" />


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
