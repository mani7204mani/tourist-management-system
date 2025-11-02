// frontend/src/ProfileMenu.js - UPDATED CODE
import React, { useState } from 'react';

function ProfileMenu({ username, handleLogout, setIsProfileOpen, isAdmin, openAdminTool }) {
    const [isOpen, setIsOpen] = useState(false);
    // NEW STATE: Tracks if the image failed to load, to show the initial instead
    const [showFallback, setShowFallback] = useState(false);

    // Get the first letter of the username, or '?' if username is not set
    const userInitial = username ? username.charAt(0).toUpperCase() : '?';

    // Function to open the modal and set the starting tab
    const openModal = (tabName) => {
        setIsProfileOpen({ isOpen: true, activeTab: tabName });
        setIsOpen(false); // Close the dropdown menu
    };

    return (
        <div className="profile-container">
            {/* Profile Icon with Image - Clicking toggles the dropdown */}
            <div className="profile-icon" onClick={() => setIsOpen(!isOpen)}>
                
                {/* CONDITIONAL RENDERING: Show initial if image fails, otherwise try image */}
                {showFallback || !username ? (
                    // 1. FALLBACK: Display the username initial
                    <div className="profile-initial">
                        {userInitial}
                    </div>
                ) : (
                    // 2. PRIMARY: Try to display the image
                    <img 
                        src="/profile-icon.png" 
                        alt="Profile" 
                        // If the image fails to load, set showFallback to true
                        onError={() => setShowFallback(true)}
                    />
                )}

            </div>

            {/* Profile Dropdown Menu (The rest of the code is unchanged) */}
            {isOpen && (
                <div className="profile-dropdown">
                    <p className="dropdown-username">{username}</p>
                    <hr />
                    
                    <div className="dropdown-item" onClick={() => openModal('profile')}>
                        Your Profile
                    </div>
                    
                    <div className="dropdown-item" onClick={() => openModal('settings')}>
                        Settings
                    </div>
                    
                    {isAdmin && (
                        <>
                            <hr />
                            <div 
                                className="dropdown-item admin-action" 
                                onClick={() => {
                                    openAdminTool('user_bookings');
                                    setIsOpen(false); 
                                }}
                            >
                                User Bookings
                            </div>
                        </>
                    )}
                    
                    <hr />
                    
                    <div className="dropdown-item logout" onClick={handleLogout}>
                        Logout
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfileMenu;