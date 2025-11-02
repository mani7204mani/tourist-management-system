// frontend/src/PackageFilter.js - WITH DYNAMIC PLACES & COUNTRIES

import React, { useState, useEffect } from 'react';
import FilterModal from './FilterModal';

const PERSON_OPTIONS = Array.from({ length: 10 }, (_, i) => i + 1);
const PAYMENT_OPTIONS = ["UPI", "Debit/Credit Cards", "Offline Payment"];

function PackageFilter({ onFilter }) {
    const [places, setPlaces] = useState([]); 
    const [countries, setCountries] = useState([]);
    const [persons, setPersons] = useState(1);
    const [payment, setPayment] = useState("UPI");
    
    // Dynamic options from database
    const [placeOptions, setPlaceOptions] = useState([]);
    const [countryOptions, setCountryOptions] = useState([]);
    
    const [openModal, setOpenModal] = useState(null);

    // Fetch available places and countries from database
    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const response = await fetch('/api/tours');
                if (response.ok) {
                    const tours = await response.json();
                    
                    // Extract unique places and countries
                    const uniquePlaces = [...new Set(tours.map(t => t.name))];
                    const uniqueCountries = [...new Set(tours.map(t => t.country))];
                    
                    setPlaceOptions(uniquePlaces);
                    setCountryOptions(uniqueCountries);
                }
            } catch (error) {
                console.error('Error fetching filter options:', error);
            }
        };
        
        fetchOptions();
    }, []);

    const handleToggle = (item, setState, currentState) => {
        if (currentState.includes(item)) {
            setState(currentState.filter(i => i !== item));
        } else {
            setState([...currentState, item]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFilter({ places, countries, persons, payment });
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="package-filter-form">
                
                <button type="button" onClick={() => setOpenModal('places')} className="filter-btn">
                    Places ({places.length || 'All'})
                </button>

                <button type="button" onClick={() => setOpenModal('countries')} className="filter-btn">
                    Countries ({countries.length || 'All'})
                </button>

                <select value={persons} onChange={(e) => setPersons(e.target.value)} className="filter-dropdown single-select">
                    {PERSON_OPTIONS.map(num => <option key={num} value={num}>{num} Persons</option>)}
                </select>

                <select value={payment} onChange={(e) => setPayment(e.target.value)} className="filter-dropdown single-select">
                    {PAYMENT_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>

                <button type="submit" className="filter-submit-btn">Filter Packages</button>
            </form>

            {openModal === 'places' && (
                <FilterModal
                    title="Places"
                    options={placeOptions}
                    selectedItems={places}
                    onToggle={(item) => handleToggle(item, setPlaces, places)}
                    onClose={() => setOpenModal(null)}
                />
            )}
            {openModal === 'countries' && (
                <FilterModal
                    title="Countries"
                    options={countryOptions}
                    selectedItems={countries}
                    onToggle={(item) => handleToggle(item, setCountries, countries)}
                    onClose={() => setOpenModal(null)}
                />
            )}
        </>
    );
}

export default PackageFilter;