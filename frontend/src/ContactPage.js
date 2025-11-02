// frontend/src/ContactPage.js - NEW FILE

import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaPaperPlane } from 'react-icons/fa';

function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Sending...');

        // 🚨 NEXT STEP: Send data to a new Flask API endpoint
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setStatus('Message sent successfully! We will get back to you soon.');
                setFormData({ name: '', email: '', message: '' }); // Clear form
            } else {
                setStatus('Failed to send message. Please try again later.');
            }
        } catch (error) {
            setStatus('Network error. Check your connection.');
        }
    };

    return (
        <div className="dashboard-content contact-page-container">
            <h1 className="contact-main-title">Get in Touch</h1>

            <div className="contact-layout">
                
                {/* --- Left Side: Information --- */}
                <div className="contact-info-panel">
                    <h2 className="info-heading">Contact Information</h2>
                    <p className="info-text">We are here to assist you with any questions or booking needs.</p>

                    <div className="contact-details-group">
                        <div className="contact-detail">
                            <FaMapMarkerAlt size={20} className="contact-icon" />
                            <span>Kandanchavadi ,Chennai ,Tamil Nadu - 600096</span>
                        </div>
                        <div className="contact-detail">
                            <FaPhone size={20} className="contact-icon" />
                            <span>+91 6301585008</span>
                        </div>
                        <div className="contact-detail">
                            <FaEnvelope size={20} className="contact-icon" />
                            <span>mani7204mani@gmail.com</span>
                        </div>
                    </div>
                </div>

                {/* --- Right Side: Contact Form --- */}
                <div className="contact-form-panel">
                    <h2 className="info-heading">Send Us a Message</h2>
                    
                    <form onSubmit={handleSubmit} className="contact-form">
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="Your Name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                            className="contact-input"
                        />
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Your Email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                            className="contact-input"
                        />
                        <textarea 
                            name="message" 
                            placeholder="Your Message..." 
                            value={formData.message} 
                            onChange={handleChange} 
                            required 
                            className="contact-textarea"
                            rows="5"
                        />

                        <button type="submit" className="contact-submit-btn" disabled={status === 'Sending...'}>
                            <FaPaperPlane className="send-icon" /> {status || 'Send Message'}
                        </button>
                    </form>

                    {status && status !== 'Sending...' && <p className="form-status">{status}</p>}
                </div>
            </div>
        </div>
    );
}

export default ContactPage;