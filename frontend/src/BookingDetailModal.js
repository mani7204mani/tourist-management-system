// frontend/src/BookingDetailModal.js - COMPLETE FIXED VERSION

import React, { useState } from 'react';

function BookingDetailModal({ booking, onClose, onBookingCancelled }) {
    const [cancelling, setCancelling] = useState(false);
    const [cancelMessage, setCancelMessage] = useState(null);

    const handleCancelBooking = async () => {
        if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
            return;
        }

        setCancelling(true);
        setCancelMessage({ type: 'info', text: 'Cancelling booking...' });

        try {
            // FIX 1: Use backticks (`) for template literals to correctly interpolate the booking.id.
            const response = await fetch(`/api/bookings/${booking.id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            const data = await response.json();

            if (response.ok) {
                setCancelMessage({ type: 'success', text: '✅ Booking cancelled successfully!' });
                setTimeout(() => {
                    if (onBookingCancelled) {
                        onBookingCancelled(booking.id);
                    }
                    onClose();
                }, 1500);
            } else {
                setCancelMessage({ type: 'error', text: data.message || 'Failed to cancel booking.' });
                setCancelling(false);
            }
        } catch (error) {
            console.error('Cancel booking error:', error);
            setCancelMessage({ type: 'error', text: 'Network error. Please try again.' });
            setCancelling(false);
        }
    };

    return (
        <div className="filter-modal-backdrop" onClick={onClose}>
            <div 
                className="filter-modal-content booking-detail-modal-fixed" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header">
                    <h2 className="modal-title-override booking-detail-title">Booking Details</h2>
                    <button onClick={onClose} className="close-btn premium-close-btn">
                        ✕
                    </button>
                </div>
                
                <div className="booking-detail-content">
                    {/* Booking Image */}
                    <div 
                        className="booking-detail-image"
                        // FIX 2: Correct the inline style object syntax. Must use the inner-quotes correctly.
                        style={{ backgroundImage: `url(${booking.image})` }} 
                    />
                    
                    {/* Cancel Message */}
                    {cancelMessage && (
                        // FIX 3: Correct the template literal for the className prop using backticks (`) and ${}.
                        <div className={`premium-status-message ${cancelMessage.type}`}>
                            {cancelMessage.text}
                        </div>
                    )}
                    
                    {/* Booking Information */}
                    <div className="booking-info-grid">
                        <div className="booking-info-header">
                            <h3>{booking.package_name}</h3>
                        </div>
                        
                        {booking.username && (
                            <div className="booking-info-row">
                                <span className="info-label">Customer:</span>
                                <span className="info-value">{booking.username}</span>
                            </div>
                        )}
                        
                        <div className="booking-info-row">
                            <span className="info-label">Location:</span>
                            <span className="info-value">{booking.location}</span>
                        </div>
                        
                        <div className="booking-info-row">
                            <span className="info-label">Country:</span>
                            <span className="info-value">{booking.country || 'India'}</span>
                        </div>
                        
                        <div className="booking-info-row">
                            <span className="info-label">No. of Persons:</span>
                            <span className="info-value">{booking.persons}</span>
                        </div>
                        
                        <div className="booking-info-row">
                            <span className="info-label">Price per Person:</span>
                            <span className="info-value">${booking.price_per_person}</span>
                        </div>
                        
                        <div className="booking-info-row">
                            <span className="info-label">Payment Mode:</span>
                            <span className="info-value">{booking.payment_mode || 'UPI'}</span>
                        </div>
                        
                        <div className="booking-info-row highlight-row">
                            <span className="info-label">Total Paid:</span>
                            <span className="info-value total-price">${booking.total_paid}</span>
                        </div>
                        
                        <div className="booking-info-row">
                            <span className="info-label">Booking Date:</span>
                            <span className="info-value">{booking.booking_date}</span>
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="booking-detail-actions">
                        <button 
                            onClick={handleCancelBooking}
                            className="cancel-booking-btn"
                            disabled={cancelling}
                        >
                            {cancelling ? 'Cancelling...' : 'Cancel Booking'}
                        </button>
                        <button 
                            onClick={onClose}
                            className="close-booking-btn"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BookingDetailModal;