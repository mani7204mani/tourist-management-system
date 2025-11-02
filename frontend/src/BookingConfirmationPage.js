import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const isValidMobile = (number) => {
    return /^\d{10}$/.test(number);
};

function BookingConfirmationPage() {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    if (!location.state || !location.state.package) {
        return (
            <div className="dashboard-content">
                <p>Error: No package selected. <a href="/packages">Go back to Packages.</a></p>
            </div>
        );
    }
    
    const { package: packageData, persons, totalPrice, payment } = location.state;
    const imageFilename = packageData.image.split('/').pop();
    const paymentMode = payment || 'UPI';

    const handleConfirm = async () => {
        setError('');

        if (!mobile || !isValidMobile(mobile)) {
            setError('Please enter a valid 10-digit mobile number.');
            return;
        }
        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address.');
            return;
        }

        setIsProcessing(true);

        try {
            const response = await fetch('/api/confirm_booking', { 
                method: 'POST', 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify({ 
                    email: email, 
                    mobile: mobile, 
                    package_name: packageData.name, 
                    total_price: totalPrice,
                    image_filename: imageFilename, 
                    location: packageData.location,
                    country: packageData.country,
                    persons: persons, 
                    price_per_person: packageData.price,
                    payment_mode: paymentMode
                }) 
            });

            const data = await response.json();
            
            if (response.ok) {
                alert('Booking confirmed successfully! 🎉\n\nConfirmation email has been sent to your email address.');
                navigate('/', { state: { bookingSuccess: true } });
            } else {
                setError(data.message || 'Booking failed. Please try again.');
            }
        } catch (error) {
            console.error('Booking error:', error);
            setError('Network error. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCancel = () => {
        navigate('/packages');
    };
    
    return (
        <div className="dashboard-content confirmation-page-container">
            <div className="confirmation-box">
                
                <h1 className="confirmation-title">Confirm Your Booking</h1>
                <h2 className="package-name">{packageData.name}</h2>
                
                {/* Fixed Image Display */}
                <div className="place-image-preview-wrapper">
                    <img 
                        src={packageData.image} 
                        alt={packageData.name}
                        className="place-image-preview-img"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/Tour.jpg'; // Fallback image
                        }}
                    />
                </div>
                
                {error && <p className="status-message error-warning">{error}</p>}

                <div className="input-group-booking">
                    <input 
                        type="email" 
                        placeholder="Type email to send confirmation"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="booking-input"
                        disabled={isProcessing}
                    />
                    <input 
                        type="tel" 
                        placeholder="Your 10-digit mobile number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="booking-input"
                        maxLength="10"
                        disabled={isProcessing}
                    />
                </div>
                
                <div className="details-summary">
                    <p>
                        <span className="detail-label">Location:</span> 
                        <span className="detail-value">{packageData.location}, {packageData.country}</span>
                    </p>
                    <p>
                        <span className="detail-label">Price per Person:</span> 
                        <span className="detail-value">${packageData.price}</span>
                    </p>
                    <p>
                        <span className="detail-label">Number of Persons:</span> 
                        <span className="detail-value">{persons}</span>
                    </p>
                    <p>
                        <span className="detail-label">Payment Mode:</span> 
                        <span className="detail-value">{paymentMode}</span>
                    </p>
                    
                    <div className="total-price-section">
                        <span className="detail-label">Total Payable:</span> 
                        <span className="price-tag">${totalPrice}</span>
                    </div>
                </div>

                <div className="button-group">
                    <button 
                        onClick={handleConfirm} 
                        className="confirm-btn"
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Processing...' : 'Confirm & Pay'}
                    </button>
                    <button 
                        onClick={handleCancel} 
                        className="cancel-btn"
                        disabled={isProcessing}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BookingConfirmationPage;