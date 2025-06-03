import React from 'react';
import './ViewToggle.css';

interface ViewToggleProps {
    mode: 'table' | 'gallery';
    onChange: (mode: 'table' | 'gallery') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ mode, onChange }) => {
    return (
        <div className="view-toggle">
            <button
                className={`toggle-button ${mode === 'table' ? 'active' : ''}`}
                onClick={() => onChange('table')}
            >
                📋 Table View
            </button>
            <button
                className={`toggle-button ${mode === 'gallery' ? 'active' : ''}`}
                onClick={() => onChange('gallery')}
            >
                🖼️ Gallery View
            </button>
        </div>
    );
};