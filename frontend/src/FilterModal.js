// frontend/src/FilterModal.js - NEW FILE

import React from 'react';

function FilterModal({ title, options, selectedItems, onToggle, onClose }) {
    return (
        <div className="filter-modal-backdrop" onClick={onClose}>
            <div className="filter-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Select {title}</h3>
                    <button onClick={onClose} className="close-btn">X</button>
                </div>
                
                <div className="checkbox-list">
                    {/* Render a list of checkboxes for all options */}
                    {options.map((option, index) => (
                        <label key={index} className="checkbox-item">
                            <input
                                type="checkbox"
                                value={option}
                                checked={selectedItems.includes(option)}
                                onChange={() => onToggle(option)}
                            />
                            {option}
                        </label>
                    ))}
                </div>
                
                <button onClick={onClose} className="modal-apply-btn">Apply Filters ({selectedItems.length})</button>
            </div>
        </div>
    );
}

export default FilterModal;