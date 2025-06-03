import React, { useState } from 'react';
import { bookApi } from '../../services/bookApi';
import { GenerationParameters } from '../../types/GenerationParameters';
import './ExportButton.css';

interface ExportButtonProps {
    totalBooks: number;
    locale: string;
    seed: number;
    averageLikes: number;
    averageReviews: number;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
    totalBooks,
    locale,
    seed,
    averageLikes,
    averageReviews
}) => {
    const [loading, setLoading] = useState(false);

    const handleExport = async () => {
        if (loading || totalBooks === 0) return;

        setLoading(true);
        try {
            const params: GenerationParameters = {
                locale,
                seed,
                averageLikes,
                averageReviews,
                start: 0,
                count: totalBooks
            };

            const blob = await bookApi.exportCsv(params);
            
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `books_${locale}_${seed}_${totalBooks}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Failed to export CSV. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            className="export-button"
            onClick={handleExport}
            disabled={loading || totalBooks === 0}
        >
            {loading ? 'Exporting...' : `Export ${totalBooks} books to CSV`}
        </button>
    );
};