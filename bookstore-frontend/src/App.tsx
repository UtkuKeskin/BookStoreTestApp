import React, { useState } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { BookTable } from './components/BookTable';
import { GalleryView } from './components/GalleryView';
import { ViewToggle } from './components/ViewToggle';
import { ExportButton } from './components/ExportButton';
import './App.css';

function App() {
    const [viewMode, setViewMode] = useState<'table' | 'gallery'>('table');
    const [locale, setLocale] = useState('en-US');
    const [seed, setSeed] = useState(42);
    const [averageLikes, setAverageLikes] = useState(5);
    const [averageReviews, setAverageReviews] = useState(3);
    const [totalBooks, setTotalBooks] = useState(0);

    const handleRandomSeed = () => {
        setSeed(Math.floor(Math.random() * 1000000));
    };

    const handleBookCountChange = (count: number) => {
        setTotalBooks(count);
    };

    React.useEffect(() => {
        setTotalBooks(0);
    }, [locale, seed, averageLikes, averageReviews]);

    return (
        <div className="app">
            <header className="app-header">
                <h1>📚 Book Store Test Data Generator</h1>
            </header>
            
            <main className="app-main">
                <ControlPanel 
                    locale={locale}
                    seed={seed}
                    averageLikes={averageLikes}
                    averageReviews={averageReviews}
                    onLocaleChange={setLocale}
                    onSeedChange={setSeed}
                    onLikesChange={setAverageLikes}
                    onReviewsChange={setAverageReviews}
                    onRandomSeed={handleRandomSeed}
                />
                
                <div className="view-controls">
                    <ViewToggle mode={viewMode} onChange={setViewMode} />
                    <ExportButton
                        totalBooks={totalBooks}
                        locale={locale}
                        seed={seed}
                        averageLikes={averageLikes}
                        averageReviews={averageReviews}
                    />
                </div>
                
                {viewMode === 'table' ? (
                    <BookTable 
                        locale={locale}
                        seed={seed}
                        averageLikes={averageLikes}
                        averageReviews={averageReviews}
                        onBookCountChange={handleBookCountChange}
                    />
                ) : (
                    <GalleryView
                        locale={locale}
                        seed={seed}
                        averageLikes={averageLikes}
                        averageReviews={averageReviews}
                        onBookCountChange={handleBookCountChange}
                    />
                )}
            </main>
        </div>
    );
}

export default App;