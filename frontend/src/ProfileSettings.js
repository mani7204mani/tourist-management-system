import React, { useState, useEffect } from 'react';
import BookingDetailModal from './BookingDetailModal';

// Previous Bookings Component
function PreviousBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    
    const fetchBookings = async () => {
        try {
            const response = await fetch('/api/bookings/my_history', {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setBookings(data);
            } else {
                console.error("Failed to fetch bookings");
            }
        } catch (error) {
            console.error("Failed to fetch bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleBookingCancelled = (bookingId) => {
        setBookings(bookings.filter(b => b.id !== bookingId));
    };

    if (loading) {
        return <p className="loading-message">Loading past bookings...</p>;
    }
    
    return (
        <>
            <h3 className="profile-section-heading">Previous Bookings</h3>
            <div className="previous-bookings-scroll-container">
                <div className="previous-bookings-list">
                    {bookings.length === 0 ? (
                        <p className="no-bookings-message">You have no previous bookings yet.</p>
                    ) : (
                        bookings.map(booking => (
                            <div
                                key={booking.id}
                                className="booking-card"
                                onClick={() => setSelectedBooking(booking)}
                            >
                                <div className="booking-card-image"
                                    style={{ backgroundImage: `url(${booking.image})` }}
                                >
                                    <span className="booking-card-title">Trip to {booking.package_name}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            
            {selectedBooking && (
                <BookingDetailModal
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                    onBookingCancelled={handleBookingCancelled}
                />
            )}
        </>
    );
}

// Rewards Component
const Rewards = () => (
    <div className="tab-content-item reward-feedback-item">
        <h3>Rewards</h3>
        <p>Check back later for exclusive member rewards and loyalty points!</p>
    </div>
);

// Feedback Component
const Feedback = () => (
    <div className="tab-content-item reward-feedback-item">
        <h3>Feedback</h3>
        <p>Share your experience with us to improve service quality.</p>
    </div>
);

// Updated Settings Tab with Email and Phone Update
function SettingsTab({ username, email, phone, onUpdate }) {
    const [newUsername, setNewUsername] = useState(username);
    const [newEmail, setNewEmail] = useState(email);
    const [newPhone, setNewPhone] = useState(phone);
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState(null);
    
    const handleUsernameUpdate = async () => {
        if (!newUsername || newUsername.trim() === '') {
            setMessage({ type: 'error', text: 'Username cannot be empty.' });
            return;
        }

        if (newUsername === username) {
            setMessage({ type: 'info', text: 'Username is the same. No changes made.' });
            return;
        }

        setMessage({ type: 'info', text: 'Updating username...' });

        try {
            const response = await fetch('/api/update_username', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ new_username: newUsername })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: data.message || 'Username updated successfully!' });
                if (onUpdate) {
                    onUpdate();
                }
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to update username.' });
            }
        } catch (error) {
            console.error('Username update error:', error);
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        }
    };

    const handleEmailUpdate = async () => {
        if (!newEmail || !newEmail.includes('@')) {
            setMessage({ type: 'error', text: 'Please enter a valid email address.' });
            return;
        }

        if (newEmail === email) {
            setMessage({ type: 'info', text: 'Email is the same. No changes made.' });
            return;
        }

        setMessage({ type: 'info', text: 'Updating email...' });

        try {
            const response = await fetch('/api/update_email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ new_email: newEmail })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: data.message || 'Email updated successfully!' });
                if (onUpdate) {
                    onUpdate();
                }
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to update email.' });
            }
        } catch (error) {
            console.error('Email update error:', error);
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        }
    };

    const handlePhoneUpdate = async () => {
        if (!newPhone || newPhone.length !== 10 || !/^\d{10}$/.test(newPhone)) {
            setMessage({ type: 'error', text: 'Please enter a valid 10-digit phone number.' });
            return;
        }

        if (newPhone === phone) {
            setMessage({ type: 'info', text: 'Phone number is the same. No changes made.' });
            return;
        }

        setMessage({ type: 'info', text: 'Updating phone number...' });

        try {
            const response = await fetch('/api/update_phone', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ new_phone: newPhone })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: data.message || 'Phone updated successfully!' });
                if (onUpdate) {
                    onUpdate();
                }
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to update phone.' });
            }
        } catch (error) {
            console.error('Phone update error:', error);
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        }
    };

    const handlePasswordUpdate = async () => {
        if (!newPassword || newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Password must be at least 6 characters.' });
            return;
        }

        setMessage({ type: 'info', text: 'Updating password...' });

        try {
            const response = await fetch('/api/update_password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ new_password: newPassword })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: data.message || 'Password updated successfully!' });
                setNewPassword('');
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to update password.' });
            }
        } catch (error) {
            console.error('Password update error:', error);
            setMessage({ type: 'error', text: 'Network error. Please try again.' });
        }
    };

    return (
        <div className="settings-tab-content">
            {message && (
                <p className={`status-message-box ${message.type}`}>
                    {message.text}
                </p>
            )}

            <div className="setting-input-group">
                <h3>Update Username</h3>
                <input 
                    type="text" 
                    value={newUsername} 
                    onChange={(e) => setNewUsername(e.target.value)} 
                    className="profile-input"
                    placeholder="Enter new username"
                />
                <button onClick={handleUsernameUpdate} className="profile-action-btn">
                    Save Username
                </button>
            </div>

            <div className="setting-input-group">
                <h3>Update Email</h3>
                <input 
                    type="email" 
                    value={newEmail} 
                    onChange={(e) => setNewEmail(e.target.value)} 
                    className="profile-input"
                    placeholder="Enter new email"
                />
                <button onClick={handleEmailUpdate} className="profile-action-btn">
                    Save Email
                </button>
            </div>

            <div className="setting-input-group">
                <h3>Update Phone Number</h3>
                <input 
                    type="tel" 
                    value={newPhone} 
                    onChange={(e) => setNewPhone(e.target.value)} 
                    className="profile-input"
                    placeholder="Enter 10-digit phone"
                    maxLength="10"
                />
                <button onClick={handlePhoneUpdate} className="profile-action-btn">
                    Save Phone
                </button>
            </div>

            <div className="setting-input-group">
                <h3>Update Password</h3>
                <input 
                    type="password" 
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                    placeholder="New Password (min 6 characters)" 
                    className="profile-input"
                />
                <button onClick={handlePasswordUpdate} className="profile-action-btn">
                    Save Password
                </button>
            </div>
        </div>
    );
}

// Main Modal Component
function ProfileSettings({ username, email, phone, activeTab, setIsProfileOpen, onUpdate }) {
    
    const handleClose = () => {
        setIsProfileOpen({ isOpen: false, activeTab: activeTab });
    };

    const handleModalClick = (e) => {
        e.stopPropagation();
    };
    
    const renderContent = () => {
        if (activeTab === 'profile') {
            return (
                <div className="profile-tab-content non-scrolling-content">
                    <div className="profile-overview-header">
                        <h2 className="profile-main-heading">Your Profile Overview</h2>
                        <div className="account-details-box">
                            Account Overview for: <span className="highlight-username">{username}</span>
                        </div>
                    </div>
                    
                    <PreviousBookings />
                    <Rewards />
                    <Feedback />
                </div>
            );
        } else if (activeTab === 'settings') {
            return (
                <div className="profile-tab-content">
                    <h2 className="profile-main-heading">User Settings</h2>
                    <SettingsTab 
                        username={username} 
                        email={email}
                        phone={phone}
                        onUpdate={onUpdate} 
                    />
                </div>
            );
        }
        return <p>Loading...</p>;
    };

    return (
        <div className="filter-modal-backdrop" onClick={handleClose}>
            <div className="filter-modal-content profile-modal-width profile-settings-modal" onClick={handleModalClick}>
                
                <div className="modal-header-non-tabbed">
                    <h1 className="modal-title-override">
                            {activeTab === 'profile' ? 'Profile' : 'Settings'}
                    </h1>
                    <button onClick={handleClose} className="close-btn premium-close-btn">X</button>
                </div>

                <div className="modal-content-body profile-content-body">
                    {renderContent()}
                </div>

            </div>
        </div>
    );
}

export default ProfileSettings;