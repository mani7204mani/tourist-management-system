import React, { useState, useEffect } from 'react';
import { FaPlusCircle, FaTrash } from 'react-icons/fa';
import BookingDetailModal from './BookingDetailModal';

// --- Add Place Form ---
function AddPlaceForm({ onAddSuccess }) {
    const [formData, setFormData] = useState({
        name: '', 
        location: '', 
        country: '', 
        price: '', 
        description: '', 
        image_path: ''
    });
    const [status, setStatus] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'info', message: 'Creating place...' });

        try {
            const response = await fetch('/api/admin/tours', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    ...formData, 
                    price: parseFloat(formData.price) 
                })
            });

            const data = await response.json();
            
            if (response.ok) {
                setStatus({ type: 'success', message: `✅ ${data.message}` });
                setFormData({
                    name: '', 
                    location: '', 
                    country: '', 
                    price: '', 
                    description: '', 
                    image_path: ''
                });
                setTimeout(() => {
                    onAddSuccess();
                }, 1500);
            } else {
                setStatus({ type: 'error', message: data.message || 'Failed to add tour.' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Network error. Please try again.' });
            console.error('Add place error:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="premium-admin-form">
            <h3 className="premium-form-title">Create New Destination</h3>
            
            {status && (
                // FIX 1: Use backticks (`) for template literal in className
                <div className={`premium-status-message ${status.type}`}>
                    {status.message}
                </div>
            )}

            <div className="premium-input-group">
                <label className="premium-label">Destination Name</label>
                <input 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="e.g., Eiffel Tower" 
                    className="premium-input"
                    required 
                />
            </div>

            <div className="premium-input-row">
                <div className="premium-input-group half">
                    <label className="premium-label">Location</label>
                    <input 
                        name="location" 
                        value={formData.location} 
                        onChange={handleChange} 
                        placeholder="e.g., Paris" 
                        className="premium-input"
                        required 
                    />
                </div>
                <div className="premium-input-group half">
                    <label className="premium-label">Country</label>
                    <input 
                        name="country" 
                        value={formData.country} 
                        onChange={handleChange} 
                        placeholder="e.g., France" 
                        className="premium-input"
                        required 
                    />
                </div>
            </div>

            <div className="premium-input-row">
                <div className="premium-input-group half">
                    <label className="premium-label">Price (per person)</label>
                    <input 
                        name="price" 
                        type="number" 
                        step="0.01"
                        value={formData.price} 
                        onChange={handleChange} 
                        placeholder="1500.00" 
                        className="premium-input"
                        required 
                    />
                </div>
                <div className="premium-input-group half">
                    <label className="premium-label">Image Path</label>
                    <input 
                        name="image_path" 
                        value={formData.image_path} 
                        onChange={handleChange} 
                        placeholder="/eiffel.webp" 
                        className="premium-input"
                        required 
                    />
                </div>
            </div>

            <div className="premium-input-group">
                <label className="premium-label">Description</label>
                <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    placeholder="Describe this amazing destination..." 
                    rows="4" 
                    className="premium-textarea"
                    required 
                />
            </div>
            
            <button type="submit" className="premium-submit-btn">
                Create Destination
            </button>
        </form>
    );
}

// --- Manage Places (with Delete) ---
function ManagePlaces({ onPlaceDeleted }) {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteStatus, setDeleteStatus] = useState(null);

    const fetchPlaces = async () => {
        try {
            const response = await fetch('/api/admin/tours');
            if (response.ok) {
                const data = await response.json();
                setPlaces(data);
            }
        } catch (error) {
            console.error("Error fetching places:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaces();
    }, []);

    const handleDelete = async (tourId, tourName) => {
        // Use backticks (`) for template literal in string
        if (!window.confirm(`Are you sure you want to delete "${tourName}"? This action cannot be undone.`)) {
            return;
        }

        setDeleteStatus({ type: 'info', message: 'Deleting...' });

        try {
            // Use backticks (`) for template literal in fetch URL
            const response = await fetch(`/api/admin/tours/${tourId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (response.ok) {
                setDeleteStatus({ type: 'success', message: `✅ ${data.message}` });
                fetchPlaces(); // Refresh list
                if (onPlaceDeleted) onPlaceDeleted();
            } else {
                setDeleteStatus({ type: 'error', message: data.message || 'Deletion failed.' });
            }
        } catch (error) {
            setDeleteStatus({ type: 'error', message: 'Network error during deletion.' });
        }

        setTimeout(() => setDeleteStatus(null), 3000);
    };

    if (loading) {
        return <p style={{ textAlign: 'center', padding: '20px', color: '#fff' }}>Loading places...</p>;
    }

    return (
        <div className="manage-places-container">
            <h3 className="premium-form-title">Manage Existing Places</h3>
            
            {deleteStatus && (
                // FIX 2: Use backticks (`) for template literal in className
                <div className={`premium-status-message ${deleteStatus.type}`}>
                    {deleteStatus.message}
                </div>
            )}

            {places.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#ccc', padding: '30px' }}>
                    No places available. Create one above!
                </p>
            ) : (
                <div className="places-manage-list">
                    {places.map(place => (
                        <div key={place.id} className="place-manage-card">
                            <div 
                                className="place-manage-image"
                                // FIX 3: Use backticks (`) for template literal in style value
                                style={{ backgroundImage: `url(${place.image_path})` }}
                            />
                            <div className="place-manage-details">
                                <h4>{place.name}</h4>
                                <p>{place.location}, {place.country}</p>
                                <span className="place-price">${place.price}</span>
                            </div>
                            <button 
                                onClick={() => handleDelete(place.id, place.name)}
                                className="place-delete-btn"
                                title="Delete this place"
                            >
                                <FaTrash />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// --- User Bookings List ---
function UserBookingsList() {
    const [allBookings, setAllBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllBookings = async () => {
            try {
                const response = await fetch('/api/admin/bookings');
                
                if (response.ok) {
                    const data = await response.json();
                    setAllBookings(data);
                } else if (response.status === 403) {
                    setError('Access denied. Admin privileges required.');
                } else {
                    setError('Failed to fetch bookings.');
                }
            } catch (error) {
                console.error("Admin fetch error:", error);
                setError('Network error. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchAllBookings();
    }, []);

    if (loading) {
        return <p style={{ textAlign: 'center', padding: '20px', color: '#fff' }}>Loading bookings...</p>;
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '20px', color: '#ff6b6b' }}>
                <p>⚠ {error}</p>
            </div>
        );
    }

    if (allBookings.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '20px', color: '#ccc' }}>
                <p>No bookings found in the system.</p>
            </div>
        );
    }

    return (
        <div className="user-bookings-admin-view">
            <h3 className="premium-form-title">
                All User Bookings ({allBookings.length})
            </h3>
            <div className="previous-bookings-scroll-container admin-scroll">
                <div className="previous-bookings-list">
                    {allBookings.map(booking => (
                        <div
                            key={booking.id}
                            className="booking-card admin-card"
                            onClick={() => setSelectedBooking(booking)}
                            style={{ cursor: 'pointer' }}
                        >
                            <div 
                                className="booking-card-image"
                                // FIX 4: Use backticks (`) for template literal in style value
                                style={{ backgroundImage: `url(${booking.image})` }}
                            >
                                <span className="booking-card-title">
                                    User: {booking.username} | Package: {booking.package_name}
                                </span>
                            </div>
                            <div style={{ padding: '10px', backgroundColor: '#2a2d3a' }}>
                                <p style={{ margin: '5px 0', fontSize: '14px', color: '#e0e0e0' }}>
                                    <strong>Location:</strong> {booking.location}
                                </p>
                                <p style={{ margin: '5px 0', fontSize: '14px', color: '#e0e0e0' }}>
                                    <strong>Persons:</strong> {booking.persons} | 
                                    <strong> Total:</strong> ${booking.total_paid}
                                </p>
                                <p style={{ margin: '5px 0', fontSize: '12px', color: '#999' }}>
                                    Booked on: {booking.booking_date}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {selectedBooking && (
                <BookingDetailModal
                    booking={selectedBooking}
                    onClose={() => setSelectedBooking(null)}
                />
            )}
        </div>
    );
}

// --- Main Admin Tool Modal ---
function AdminToolModal({ activeTool, onClose }) {
    return (
        <div className="filter-modal-backdrop" onClick={onClose}>
            <div 
                className="filter-modal-content admin-tool-modal-content" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="modal-header premium-modal-header">
                    <h2 className="modal-title-override">
                        {activeTool === 'add_place' 
                            ? '🏗 Destination Management' 
                            : '📋 User Bookings Dashboard'}
                    </h2>
                    <button onClick={onClose} className="close-btn premium-close-btn">
                        ✕
                    </button>
                </div>
                
                <div className="modal-content-body premium-modal-body">
                    {activeTool === 'add_place' ? (
                        <>
                            {/* The AddPlaceForm and ManagePlaces components will re-fetch data 
                                when a new place is added or one is deleted */}
                            <AddPlaceForm onAddSuccess={() => {}} /> 
                            <div className="premium-divider"></div>
                            <ManagePlaces onPlaceDeleted={() => {}} />
                        </>
                    ) : (
                        <UserBookingsList />
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminToolModal;