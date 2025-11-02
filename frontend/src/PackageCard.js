// frontend/src/PackageCard.js - NEW FILE

import React from 'react';
// Reuse the structure from PlacesPage, ensuring required props are passed

function PackageCard({ packageData, onBookClick }) {
    return (
        <div className="flip-card package-card-item">
            <div className="card-inner">
                
                {/* Card Front: Image */}
                <div 
                    className="card-front"
                    // FIX: Use backticks (`) for the template literal to correctly interpolate 
                    // the packageData.image URL within the CSS url() function string.
                    style={{ backgroundImage: `url(${packageData.image})` }}
                >
                    <span className="place-name-front">{packageData.name}</span>
                </div>
                
                {/* Card Back: Details */}
                <div className="card-back">
                    <h3 className="back-title">{packageData.name}</h3>
                    <div className="detail-group">
                        <h4>Location:</h4>
                        <p>{packageData.location}, {packageData.country}</p>
                    </div>
                    <div className="detail-group">
                        <h4>Description:</h4>
                        <p className="description-text">{packageData.description}</p>
                    </div>
                    <div className="detail-group price-info">
                        <h4>Total Price:</h4>
                        <p className="price-tag">${packageData.price}</p>
                    </div>
                    
                </div>
                
            </div>
            <button onClick={() => onBookClick(packageData)} className="book-tour-card-btn">
                Click here to book your tour
            </button>
        </div>
    );
}

export default PackageCard;