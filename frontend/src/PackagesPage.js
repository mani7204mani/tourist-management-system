// frontend/src/PackagesPage.js - FIXED WITH PAYMENT MODE

import React, { useState, useEffect } from 'react';
import PackageFilter from './PackageFilter';
import PackageCard from './PackageCard';
import { useNavigate } from 'react-router-dom';

function PackagesPage() {
    const [filteredPackages, setFilteredPackages] = useState([]);
    const [activeFilters, setActiveFilters] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleBookTour = (packageData) => {
        const persons = activeFilters.persons || 1;
        const payment = activeFilters.payment || 'UPI';
        
        // FIX 1: Use backticks (`) for template literals to correctly build the navigation path.
        navigate(`/book/${packageData.name.replace(/\s+/g, '-')}`, {
            state: {
                package: packageData,
                persons: persons,
                totalPrice: packageData.price * persons,
                payment: payment,  // Pass payment mode explicitly
                activeFilters: activeFilters
            }
        });
    };

    const fetchPackages = async (filters) => {
        setLoading(true);
        
        // Safely handle filter values with defaults
        const safePlaces = filters.places || [];
        const safeCountries = filters.countries || [];
        
        setActiveFilters(filters);

        // Build query parameters
        const query = new URLSearchParams({
            places: safePlaces.join(','),
            countries: safeCountries.join(','),
        }).toString();

        try {
            // FIX 2: Use backticks (`) for template literals to correctly build the fetch URL.
            const response = await fetch(`/api/packages/filter?${query}`);
            if (response.ok) {
                const data = await response.json();
                setFilteredPackages(data);
                console.log('Filtered packages:', data);
            } else {
                console.error('Failed to fetch packages');
                setFilteredPackages([]);
            }
        } catch (error) {
            console.error("Error fetching packages:", error);
            setFilteredPackages([]);
        } finally {
            setLoading(false);
        }
    };
    
    // Initial load: fetch all packages
    useEffect(() => {
        fetchPackages({
            places: [],
            countries: [],
            persons: 1,
            payment: "UPI"
        });
    }, []);

    return (
        <div className="packages-page-container dashboard-content">
            <h1>Find Your Dream Package</h1>
            
            {/* Filter Component */}
            <PackageFilter onFilter={fetchPackages} />
            
            {/* Results */}
            <div className="package-results-grid">
                {loading ? (
                    <p>Searching for packages...</p>
                ) : filteredPackages.length > 0 ? (
                    filteredPackages.map(pkg => (
                        <PackageCard
                            key={pkg.id}
                            packageData={pkg}
                            onBookClick={handleBookTour}
                        />
                    ))
                ) : (
                    <p>No packages found matching your criteria. Try adjusting your filters.</p>
                )}
            </div>
        </div>
    );
}

export default PackagesPage;