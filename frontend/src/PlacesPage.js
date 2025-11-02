// frontend/src/PlacesPage.js - COMPLETE FIXED CODE

import React, { useState, useEffect } from 'react';

function PlacesPage() {
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch places from database on component mount
    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const response = await fetch('/api/tours');
                if (response.ok) {
                    const data = await response.json();
                    setPlaces(data);
                } else {
                    console.error('Failed to fetch tours');
                }
            } catch (error) {
                console.error('Error fetching places:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlaces();
    }, []);

    if (loading) {
        return (
            <div className="places-page-container">
                <h1>Top Destinations</h1>
                <p style={{ textAlign: 'center', padding: '50px' }}>Loading places...</p>
            </div>
        );
    }

    return (
        <div className="places-page-container">
            <h1>Top Destinations</h1>
            {places.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '50px' }}>
                    No places available. Admin can add new places.
                </p>
            ) : (
                <div className="places-grid">
                    {places.map(place => (
                        <div key={place.id} className="flip-card">
                            <div className="card-inner">
                                {/* Card Front: Image */}
                                <div
                                    className="card-front"
                                    // FIX: Use backticks (`) for the template literal to correctly interpolate 
                                    // the place.image URL within the CSS url() function string.
                                    style={{ backgroundImage: `url(${place.image})` }}
                                >
                                    <span className="place-name-front">{place.name}</span>
                                </div>
                                
                                {/* Card Back: Details */}
                                <div className="card-back">
                                    <h3 className="back-title">{place.name}</h3>
                                    <div className="detail-group">
                                        <h4>Location:</h4>
                                        <p>{place.location}, {place.country}</p>
                                    </div>
                                    <div className="detail-group">
                                        <h4>Description:</h4>
                                        <p className="description-text">{place.description}</p>
                                    </div>
                                    <div className="detail-group price-info">
                                        <h4>Price (per person):</h4>
                                        <p className="price-tag">${place.price}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PlacesPage;