import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import ProfileMenu from './ProfileMenu';
import ProfileSettings from './ProfileSettings';
import AdminToolModal from './AdminToolModal';

import HomePage from './HomePage';
import PlacesPage from './PlacesPage';
import BookingConfirmationPage from './BookingConfirmationPage';
import ContactPage from './ContactPage';
import PackagesPage from './PackagesPage';

function Dashboard({ username, setIsLoggedIn, setUsername }) {
  const [isProfileOpen, setIsProfileOpen] = useState({ isOpen: false, activeTab: 'profile' });
  const [isAdmin, setIsAdmin] = useState(false);
  const [isToolModalOpen, setIsToolModalOpen] = useState(false);
  const [activeTool, setActiveTool] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // User data states
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await fetch('/api/status');
        if (response.ok) {
          const data = await response.json();
          if (data.isAdmin) {
            setIsAdmin(true);
          }
          setUserEmail(data.email || '');
          setUserPhone(data.phone || '');
        }
      } catch (err) {
        console.error("Error checking user status:", err);
      }
    };
    checkUserStatus();
  }, [username]);

  const handleUpdate = async () => {
    try {
      const response = await fetch('/api/status');
      if (response.ok) {
        const data = await response.json();
        setUsername(data.username);
        setUserEmail(data.email);
        setUserPhone(data.phone);
      }
    } catch (err) {
      console.error("Error refreshing user data:", err);
    }
  };

  const handleLogout = () => {
    fetch('/api/logout', { method: 'POST' })
      .then(() => {
        setIsLoggedIn(false);
        setUsername(null);
        setIsAdmin(false);
      })
      .catch(err => console.error("Logout failed:", err));
  };

  const openAdminTool = (toolName) => {
    setActiveTool(toolName);
    setIsToolModalOpen(true);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="logo">TMS Dashboard</div>
        
        {/* Mobile Menu Toggle */}
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        
        {/* Desktop Navigation */}
        <nav className={`main-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/places" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Places</Link>
          <Link to="/packages" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Packages</Link>
          <Link to="/contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          
          {/* Mobile-only profile link */}
          <button 
            className="nav-link mobile-only profile-mobile-link" 
            onClick={() => {
              setIsProfileOpen({ isOpen: true, activeTab: 'profile' });
              setMobileMenuOpen(false);
            }}
          >
            Your Profile
          </button>
          
          <button 
            className="nav-link mobile-only settings-mobile-link" 
            onClick={() => {
              setIsProfileOpen({ isOpen: true, activeTab: 'settings' });
              setMobileMenuOpen(false);
            }}
          >
            Settings
          </button>
          
          {isAdmin && (
            <>
              <button 
                className="nav-link mobile-only admin-mobile-link" 
                onClick={() => {
                  openAdminTool('add_place');
                  setMobileMenuOpen(false);
                }}
              >
                + Add Place
              </button>
              <button 
                className="nav-link mobile-only admin-mobile-link" 
                onClick={() => {
                  openAdminTool('user_bookings');
                  setMobileMenuOpen(false);
                }}
              >
                User Bookings
              </button>
            </>
          )}
          
          <button 
            className="nav-link mobile-only logout-mobile-link" 
            onClick={() => {
              handleLogout();
              setMobileMenuOpen(false);
            }}
          >
            Logout
          </button>
        </nav>
        
        {/* Admin Add Place Button (Desktop) */}
        {isAdmin && (
          <button 
            onClick={() => openAdminTool('add_place')} 
            className="admin-header-btn desktop-only"
          >
            + Add Place
          </button>
        )}
        
        {/* Profile Menu (Desktop) */}
        <div className="desktop-only">
          <ProfileMenu
            username={username}
            handleLogout={handleLogout}
            setIsProfileOpen={setIsProfileOpen}
            isAdmin={isAdmin}
            openAdminTool={openAdminTool}
          />
        </div>
      </header>

      <div className="main-app-body">
        <Routes>
          <Route path="/" element={<HomePage username={username} />} />
          <Route path="/places" element={<PlacesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/book/:placeName" element={<BookingConfirmationPage />} />
        </Routes>
      </div>
      
      {isProfileOpen.isOpen && (
        <ProfileSettings
          username={username}
          email={userEmail}
          phone={userPhone}
          activeTab={isProfileOpen.activeTab}
          setIsProfileOpen={setIsProfileOpen}
          onUpdate={handleUpdate}
        />
      )}

      {isToolModalOpen && (
        <AdminToolModal
          activeTool={activeTool}
          onClose={() => setIsToolModalOpen(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;