import React from 'react';

function HomePage({ username }) {
    return (
        <div 
            className="home-hero-container"
            style={{
                // FIX: Use backticks (`) for the template literal to correctly interpolate 
                // the environment variable into the CSS url() function string.
                backgroundImage: `url(${process.env.PUBLIC_URL}/full-width-image.jpg)`
            }}
        >
            <div className="hero-text-overlay">
                {/* Optional: Greet the user if the username prop is provided */}
                {username ? (
                    <h1>Welcome back, {username}!</h1>
                ) : (
                    <h1>Welcome to Tourist Management System</h1>
                )}
                
                <p>Explore breathtaking destinations, book exclusive packages, and manage your unforgettable adventures.</p>
                <p>Your journey begins here—discover the world with us!</p>
            </div>
        </div>
    );
}

export default HomePage;