// frontend/src/TourManagementPage.js - NEW FILE (Read and Forms)

import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaPlusCircle } from 'react-icons/fa';

const initialTourState = {
    name: '', location: '', country: '', description: '', price: '', image_path: ''
};

function TourManagementPage() {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentTour, setCurrentTour] = useState(initialTourState);
    const [isEditing, setIsEditing] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);

    const fetchTours = async () => {
        try {
            // Fetch all tours (Admin required route)
            const response = await fetch('/api/admin/tours');
            if (response.status === 403) { // Check for Forbidden access
                setTours([]);
                setStatusMessage({type: 'error', text: 'Access Denied: Not logged in as Admin.'});
                setLoading(false);
                return;
            }
            const data = await response.json();
            setTours(data);
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTours();
    }, []);

    const handleChange = (e) => {
        setCurrentTour({ ...currentTour, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = isEditing ? 'PUT' : 'POST';
        // FIX 1: Use backticks (`) for template literal in URL
        const url = isEditing ? `/api/admin/tours/${currentTour.id}` : '/api/admin/tours';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentTour)
            });

            const data = await response.json();
            
            if (response.ok) {
                setStatusMessage({ type: 'success', text: data.message });
                fetchTours(); // Refresh list
                setIsModalOpen(false);
            } else {
                setStatusMessage({ type: 'error', text: data.message || 'Operation failed.' });
            }
        } catch (error) {
            setStatusMessage({ type: 'error', text: 'Network Error.' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this tour?")) return;
        try {
            // FIX 2: Use backticks (`) for template literal in URL
            const response = await fetch(`/api/admin/tours/${id}`, { method: 'DELETE' });
            const data = await response.json();
            if (response.ok) {
                setStatusMessage({ type: 'success', text: data.message });
                fetchTours();
            } else {
                setStatusMessage({ type: 'error', text: data.message || 'Deletion failed.' });
            }
        } catch (error) {
            setStatusMessage({ type: 'error', text: 'Network Error.' });
        }
    };

    const openEditModal = (tour) => {
        setCurrentTour(tour);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const openCreateModal = () => {
        setCurrentTour(initialTourState);
        setIsEditing(false);
        setIsModalOpen(true);
    };
    
    if (loading) return <div className="dashboard-content"><p>Loading Admin Panel...</p></div>;

    // --- Render ---
    return (
        <div className="dashboard-content admin-page-container">
            <h1>Tour Management Dashboard</h1>
            
            {statusMessage && (
                // FIX 3: Use backticks (`) for template literal in className
                <div className={`admin-status-bar ${statusMessage.type}`}>
                    {statusMessage.text}
                </div>
            )}

            <button onClick={openCreateModal} className="admin-action-btn create-btn">
                <FaPlusCircle /> Add New Tour
            </button>

            {/* Tour List Table */}
            <div className="tour-list-table">
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Location</th>
                            <th>Price</th>
                            <th>Image Path</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tours.map(tour => (
                            <tr key={tour.id}>
                                <td>{tour.id}</td>
                                <td>{tour.name}</td>
                                <td>{tour.location}</td>
                                <td>${tour.price}</td>
                                <td>{tour.image_path}</td>
                                <td>
                                    <button onClick={() => openEditModal(tour)} className="action-icon edit-icon"><FaEdit /></button>
                                    <button onClick={() => handleDelete(tour.id)} className="action-icon delete-icon"><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for Create/Update */}
            {isModalOpen && (
                <TourFormModal
                    currentTour={currentTour}
                    isEditing={isEditing}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}
export default TourManagementPage;

// --- Modal Component ---
function TourFormModal({ currentTour, isEditing, handleChange, handleSubmit, onClose }) {
    return (
        <div className="filter-modal-backdrop" onClick={onClose}>
            <div className="filter-modal-content tour-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{isEditing ? 'Edit Tour' : 'Create New Tour'}</h2>
                    <button onClick={onClose} className="close-btn premium-close-btn">X</button>
                </div>
                <form onSubmit={handleSubmit} className="tour-form">
                    <input name="name" value={currentTour.name} onChange={handleChange} placeholder="Tour Name" required />
                    <input name="location" value={currentTour.location} onChange={handleChange} placeholder="Location (e.g., Uttar Pradesh)" required />
                    <input name="country" value={currentTour.country} onChange={handleChange} placeholder="Country (e.g., India)" required />
                    <input name="price" type="number" value={currentTour.price} onChange={handleChange} placeholder="Price (e.g., 500.00)" required />
                    <input name="image_path" value={currentTour.image_path} onChange={handleChange} placeholder="Image Path (e.g., /ayodhya.webp)" required />
                    <textarea name="description" value={currentTour.description} onChange={handleChange} placeholder="Description" rows="3" required />
                    <button type="submit" className="form-submit-btn">{isEditing ? 'Save Changes' : 'Create Tour'}</button>
                </form>
            </div>
        </div>
    );
}