from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager, UserMixin, login_user, logout_user, login_required, current_user
import datetime
import os
import random
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from functools import wraps

# --- EMAIL CONFIGURATION ---
EMAIL_ADDRESS = "<your_email>@gmail.com"
EMAIL_PASSWORD = "REPLACE WITH YOUR APP PASSWORD"
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

# Store OTPs temporarily
otp_storage = {}

# --- GLOBAL SETUP ---
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
IMAGE_FOLDER = os.path.join(BASE_DIR, 'static', 'tour_images')

app = Flask(__name__)
CORS(app, supports_credentials=True)

# ========== POSTGRESQL CONFIGURATION ==========
# IMPORTANT: Update these values with your PostgreSQL credentials
app.config['SECRET_KEY'] = 'your_super_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'REPLACE WITH YOUR CONNECTION STRING'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# INSTRUCTIONS FOR UPDATING THE CONNECTION STRING:
# Format: 'postgresql://username:password@host:port/database_name'
# 
# Replace:
# - postgres: Your PostgreSQL username (default is 'postgres')
# - your_password: Your PostgreSQL password (set during installation)
# - localhost: Your database host (use 'localhost' for local development)
# - 5432: PostgreSQL port (default is 5432)
# - tms-project: Your database name (the one you created in pgAdmin)
#
# Example: 'postgresql://postgres:admin123@localhost:5432/tms-project'

db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.init_app(app)

# --- EMAIL HELPER FUNCTIONS ---
def send_email(to_email, subject, body):
    """Send email using Gmail SMTP"""
    try:
        msg = MIMEMultipart()
        msg['From'] = EMAIL_ADDRESS
        msg['To'] = to_email
        msg['Subject'] = subject
        msg.attach(MIMEText(body, 'html'))
        
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Email error: {e}")
        return False

def generate_otp():
    """Generate 6-digit OTP"""
    return str(random.randint(100000, 999999))

# --- MODELS ---
class User(db.Model, UserMixin):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(15), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    is_admin = db.Column(db.Boolean, default=False, nullable=False)
    
    bookings = db.relationship('Booking', backref='user', lazy=True, cascade='all, delete-orphan')

class Tour(db.Model):
    __tablename__ = 'tours'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)
    location = db.Column(db.String(100), nullable=False)
    country = db.Column(db.String(50), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    image_path = db.Column(db.String(200), nullable=False)

class Booking(db.Model):
    __tablename__ = 'bookings'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    package_name = db.Column(db.String(100), nullable=False)
    image_path = db.Column(db.String(200), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    country = db.Column(db.String(50), nullable=False, default='India')
    persons = db.Column(db.Integer, nullable=False)
    price_per_person = db.Column(db.Float, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    payment_mode = db.Column(db.String(50), nullable=False, default='UPI')
    booking_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin:
            return jsonify({"message": "Administrator privileges required."}), 403
        return f(*args, **kwargs)
    return decorated_function

# Create Database Tables and Default Admin
with app.app_context():
    db.create_all()
    
    admin_user = User.query.filter_by(username='admin').first()
    if not admin_user:
        hashed_password = bcrypt.generate_password_hash('admin123').decode('utf-8')
        admin_user = User(
            username='admin', 
            email='admin@tms.com',
            phone='0000000000',
            password=hashed_password, 
            is_admin=True
        )
        db.session.add(admin_user)
        db.session.commit()
        print("✅ Default admin account created: username='admin', password='admin123'")

# --- API ROUTES (No changes needed below this line) ---

# Send OTP for Registration
@app.route('/api/send_otp', methods=['POST'])
def send_otp():
    data = request.get_json()
    email = data.get('email')
    username = data.get('username')
    phone = data.get('phone')
    
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already exists. Please login to your account."}), 409
    
    if User.query.filter_by(phone=phone).first():
        return jsonify({"message": "Phone number already exists. Please login to your account."}), 409
    
    if User.query.filter_by(username=username).first():
        return jsonify({"message": "Username already exists. Please choose another."}), 409
    
    otp = generate_otp()
    otp_storage[email] = {
        'otp': otp,
        'timestamp': datetime.datetime.now(),
        'username': username,
        'phone': phone
    }
    
    subject = "Your TMS Registration OTP"
    body = f"""
    <html>
        <body style="font-family: Arial, sans-serif;">
            <h2>Welcome to Tourist Management System!</h2>
            <p>Your OTP for registration is:</p>
            <h1 style="color: #4CAF50; font-size: 32px;">{otp}</h1>
            <p>This OTP is valid for 10 minutes.</p>
            <p>If you didn't request this, please ignore this email.</p>
        </body>
    </html>
    """
    
    if send_email(email, subject, body):
        return jsonify({"message": "OTP sent successfully to your email."}), 200
    else:
        return jsonify({"message": "Failed to send OTP. Please try again."}), 500

# Verify OTP and Register
@app.route('/api/verify_register', methods=['POST'])
def verify_register():
    data = request.get_json()
    email = data.get('email')
    otp = data.get('otp')
    password = data.get('password')
    
    if email not in otp_storage:
        return jsonify({"message": "OTP expired or invalid. Please request a new one."}), 400
    
    stored_data = otp_storage[email]
    
    time_diff = datetime.datetime.now() - stored_data['timestamp']
    if time_diff.total_seconds() > 600:
        del otp_storage[email]
        return jsonify({"message": "OTP expired. Please request a new one."}), 400
    
    if stored_data['otp'] != otp:
        return jsonify({"message": "Invalid OTP. Please try again."}), 400
    
    try:
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        new_user = User(
            username=stored_data['username'],
            email=email,
            phone=stored_data['phone'],
            password=hashed_password
        )
        db.session.add(new_user)
        db.session.commit()
        
        del otp_storage[email]
        
        return jsonify({"message": "Registration successful! Please login."}), 201
    except Exception as e:
        return jsonify({"message": f"Registration failed: {str(e)}"}), 500

# Login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    user = User.query.filter_by(username=username).first()

    if user and bcrypt.check_password_hash(user.password, data['password']):
        login_user(user)
        return jsonify({
            "message": "Login successful.", 
            "user": user.username,
            "isAdmin": user.is_admin
        }), 200
    else:
        return jsonify({"message": "Login unsuccessful. Check username and password."}), 401

# User Status
@app.route('/api/status')
def get_status():
    if current_user.is_authenticated:
        return jsonify({
            'isLoggedIn': True, 
            'username': current_user.username, 
            'email': current_user.email,
            'phone': current_user.phone,
            'isAdmin': current_user.is_admin
        })
    return jsonify({
        'isLoggedIn': False, 
        'username': None,
        'email': None,
        'phone': None,
        'isAdmin': False
    })

# Logout
@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully."}), 200

# Update Username
@app.route('/api/update_username', methods=['POST'])
@login_required
def update_username():
    data = request.get_json()
    new_username = data.get('new_username')

    if not new_username:
        return jsonify({"message": "New username required."}), 400

    if User.query.filter(User.username == new_username, User.id != current_user.id).first():
        return jsonify({"message": "Username already taken."}), 409

    current_user.username = new_username
    db.session.commit()
    
    return jsonify({"message": "Username updated successfully."}), 200

# Update Email
@app.route('/api/update_email', methods=['POST'])
@login_required
def update_email():
    data = request.get_json()
    new_email = data.get('new_email')

    if not new_email or '@' not in new_email:
        return jsonify({"message": "Valid email required."}), 400

    if User.query.filter(User.email == new_email, User.id != current_user.id).first():
        return jsonify({"message": "Email already taken."}), 409

    current_user.email = new_email
    db.session.commit()
    
    return jsonify({"message": "Email updated successfully."}), 200

# Update Phone
@app.route('/api/update_phone', methods=['POST'])
@login_required
def update_phone():
    data = request.get_json()
    new_phone = data.get('new_phone')

    if not new_phone or len(new_phone) != 10:
        return jsonify({"message": "Valid 10-digit phone number required."}), 400

    if User.query.filter(User.phone == new_phone, User.id != current_user.id).first():
        return jsonify({"message": "Phone number already taken."}), 409

    current_user.phone = new_phone
    db.session.commit()
    
    return jsonify({"message": "Phone number updated successfully."}), 200

# Update Password
@app.route('/api/update_password', methods=['POST'])
@login_required
def update_password():
    data = request.get_json()
    new_password = data.get('new_password')

    if not new_password or len(new_password) < 6:
        return jsonify({"message": "Password must be at least 6 characters."}), 400

    hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
    current_user.password = hashed_password
    db.session.commit()
    
    return jsonify({"message": "Password updated successfully."}), 200

# ADMIN CRUD - Manage Tours
@app.route('/api/admin/tours', methods=['GET', 'POST'])
@admin_required
def admin_manage_tours():
    if request.method == 'POST':
        data = request.get_json()
        new_tour = Tour(
            name=data['name'], 
            location=data['location'], 
            country=data['country'],
            description=data['description'],
            price=data['price'],
            image_path=data['image_path']
        )
        try:
            db.session.add(new_tour)
            db.session.commit()
            return jsonify({"message": "Tour created successfully!", "id": new_tour.id}), 201
        except Exception as e:
            db.session.rollback()
            return jsonify({"message": f"Error creating tour: {str(e)}"}), 400

    tours = Tour.query.all()
    return jsonify([{
        'id': t.id,
        'name': t.name,
        'location': t.location,
        'country': t.country,
        'description': t.description,
        'price': t.price,
        'image_path': t.image_path
    } for t in tours])

# ADMIN CRUD - Tour Detail
@app.route('/api/admin/tours/<int:tour_id>', methods=['GET', 'PUT', 'DELETE'])
@admin_required
def admin_tour_detail(tour_id):
    tour = Tour.query.get_or_404(tour_id)
    
    if request.method == 'DELETE':
        db.session.delete(tour)
        db.session.commit()
        return jsonify({"message": "Tour deleted successfully."}), 200

    if request.method == 'PUT':
        data = request.get_json()
        tour.name = data.get('name', tour.name)
        tour.location = data.get('location', tour.location)
        tour.country = data.get('country', tour.country)
        tour.description = data.get('description', tour.description)
        tour.price = data.get('price', tour.price)
        tour.image_path = data.get('image_path', tour.image_path)
        
        db.session.commit()
        return jsonify({"message": "Tour updated successfully!"}), 200

    return jsonify({
        'id': tour.id,
        'name': tour.name,
        'location': tour.location,
        'country': tour.country,
        'description': tour.description,
        'price': tour.price,
        'image_path': tour.image_path
    })

# Get ALL Places/Tours (Public endpoint)
@app.route('/api/tours', methods=['GET'])
def get_all_tours():
    tours = Tour.query.all()
    return jsonify([{
        'id': t.id,
        'name': t.name,
        'location': t.location,
        'country': t.country,
        'description': t.description,
        'price': t.price,
        'image': t.image_path
    } for t in tours])

# Package Filtering
@app.route('/api/packages/filter', methods=['GET'])
def filter_packages():
    all_packages = Tour.query.all()
    
    ALL_PACKAGES_DB = [{
        'id': t.id, 
        'name': t.name, 
        'location': t.location, 
        'country': t.country, 
        'price': t.price, 
        'image': t.image_path, 
        'description': t.description
    } for t in all_packages]

    places_str = request.args.get('places', '')
    countries_str = request.args.get('countries', '')
    
    places_filter = [p.strip() for p in places_str.split(',') if p.strip() and p.strip() != 'All Places']
    countries_filter = [c.strip() for c in countries_str.split(',') if c.strip() and c.strip() != 'All Countries']
    
    filtered_list = ALL_PACKAGES_DB
    
    if places_filter:
        filtered_list = [p for p in filtered_list if p['name'] in places_filter]
        
    if countries_filter:
        filtered_list = [p for p in filtered_list if p['country'] in countries_filter]
        
    return jsonify(filtered_list)

# Booking Confirmation with Email
@app.route('/api/confirm_booking', methods=['POST'])
@login_required
def confirm_booking():
    data = request.get_json()
    email = data.get('email')
    mobile = data.get('mobile')
    package_name = data.get('package_name')
    total_price = data.get('total_price')
    image_filename = data.get('image_filename')
    location = data.get('location')
    country = data.get('country', 'India')
    persons = data.get('persons')
    price_per_person = data.get('price_per_person')
    payment_mode = data.get('payment_mode', 'UPI')

    if not image_filename or not email or not mobile:
        return jsonify({"message": "Missing required booking details."}), 400

    try:
        new_booking = Booking(
            user_id=current_user.id,
            package_name=package_name,
            image_path=image_filename,
            location=location,
            country=country,
            persons=persons,
            price_per_person=price_per_person,
            total_price=total_price,
            payment_mode=payment_mode,
            booking_date=datetime.datetime.utcnow()
        )
        db.session.add(new_booking)
        db.session.commit()
        
        subject = f"Booking Confirmed - {package_name}"
        body = f"""
        <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
                <h2 style="color: #4CAF50;">Booking Confirmation</h2>
                <p>Dear {current_user.username},</p>
                <p>Your booking has been confirmed! Here are the details:</p>
                
                <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Package:</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">{package_name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Location:</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">{location}, {country}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Number of Persons:</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">{persons}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Price per Person:</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">${price_per_person}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Total Amount:</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>${total_price}</strong></td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Payment Mode:</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">{payment_mode}</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;"><strong>Booking Date:</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd;">{datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")}</td>
                    </tr>
                </table>
                
                <p>Thank you for choosing our service!</p>
                <p style="color: #666; font-size: 12px;">If you have any questions, please contact us.</p>
            </body>
        </html>
        """
        
        send_email(email, subject, body)
        
        return jsonify({"message": "Booking successfully saved and confirmation email sent."}), 200

    except Exception as e:
        print(f"DATABASE ERROR: {e}")
        return jsonify({"message": f"Booking failed. Server error: {e}"}), 500

# User Booking History
@app.route('/api/bookings/my_history', methods=['GET'])
@login_required
def get_user_bookings():
    user_bookings = Booking.query.filter_by(user_id=current_user.id).all()
    bookings_list = []
    for booking in user_bookings:
        bookings_list.append({
            "id": booking.id,
            "package_name": booking.package_name,
            "image": booking.image_path,
            "location": booking.location,
            "country": booking.country,
            "persons": booking.persons,
            "price_per_person": booking.price_per_person,
            "total_paid": booking.total_price,
            "payment_mode": booking.payment_mode,
            "booking_date": booking.booking_date.strftime("%Y-%m-%d"),
            "username": current_user.username
        })
    return jsonify(bookings_list)

# Admin All Bookings
@app.route('/api/admin/bookings', methods=['GET'])
@admin_required
def get_all_bookings():
    all_bookings = Booking.query.all()
    bookings_list = []
    for booking in all_bookings:
        bookings_list.append({
            "id": booking.id,
            "user_id": booking.user_id,
            "username": booking.user.username,
            "package_name": booking.package_name,
            "image": booking.image_path,
            "location": booking.location,
            "country": booking.country,
            "persons": booking.persons,
            "price_per_person": booking.price_per_person,
            "total_paid": booking.total_price,
            "payment_mode": booking.payment_mode,
            "booking_date": booking.booking_date.strftime("%Y-%m-%d %H:%M:%S")
        })
    return jsonify(bookings_list)

# Contact Form Handler with Email
@app.route('/api/contact', methods=['POST'])
def handle_contact_form():
    data = request.get_json()
    name = data.get('name')
    user_email = data.get('email')
    message = data.get('message')
    
    if name and user_email and message:
        subject = f"Contact Form - Message from {name}"
        body = f"""
        <html>
            <body style="font-family: Arial, sans-serif;">
                <h2>New Contact Form Submission</h2>
                <p><strong>From:</strong> {name}</p>
                <p><strong>Email:</strong> {user_email}</p>
                <p><strong>Message:</strong></p>
                <p style="padding: 15px; background-color: #f5f5f5; border-left: 4px solid #4CAF50;">
                    {message}
                </p>
                <hr>
                <p style="color: #666; font-size: 12px;">
                    This message was sent from the TMS contact form. 
                    Reply directly to {user_email} to respond.
                </p>
            </body>
        </html>
        """
        
        if send_email(EMAIL_ADDRESS, subject, body):
            return jsonify({"message": "Message sent successfully!"}), 200
        else:
            return jsonify({"message": "Failed to send message. Please try again."}), 500
    else:
        return jsonify({"message": "Incomplete form data."}), 400

# Cancel Booking
@app.route('/api/bookings/<int:booking_id>', methods=['DELETE'])
@login_required
def cancel_booking(booking_id):
    booking = Booking.query.get_or_404(booking_id)
    
    if booking.user_id != current_user.id and not current_user.is_admin:
        return jsonify({"message": "Unauthorized to cancel this booking."}), 403
    
    try:
        db.session.delete(booking)
        db.session.commit()
        return jsonify({"message": "Booking cancelled successfully."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Failed to cancel booking: {str(e)}"}), 500

# Initialize Tours
@app.route('/api/init_tours')
def init_tours():
    if Tour.query.count() > 0:
        return jsonify({"message": "Tours already initialized."})
        
    data = [
        {"name": "Ayodhya", "location": "Uttar Pradesh", "country": "India", "price": 500.0, "image_path": "/ayodhya.webp", "description": "Holy City in UP"},
        {"name": "Tajmahal", "location": "Agra", "country": "India", "price": 250.0, "image_path": "/tajmahal.webp", "description": "Dedicated to his wife Mumtaz by Shajahan."},
        {"name": "Red Fort", "location": "Delhi", "country": "India", "price": 1200.0, "image_path": "/red-fort.webp", "description": "Dedicated to our independence."},
        {"name": "Pink Mahala", "location": "Jaipur", "country": "India", "price": 150.0, "image_path": "/jaipur.webp", "description": "Known as Pink City"},
        {"name": "Cholas Temple", "location": "Tamil Nadu", "country": "India", "price": 750.0, "image_path": "/temple.webp", "description": "An ancient Temple in TN built by cholas"},
        {"name": "Golden Temple", "location": "Punjab", "country": "India", "price": 900.0, "image_path": "/golden-temple.webp", "description": "Witness the temple built with gold"},
    ]
    
    try:
        for item in data:
            db.session.add(Tour(**item))
        db.session.commit()
        return jsonify({"message": "Initial 6 tours added successfully."})
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Initialization failed: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)