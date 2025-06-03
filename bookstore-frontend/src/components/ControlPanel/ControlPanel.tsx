import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './ControlPanel.css';

interface ControlPanelProps {
    locale: string;
    seed: number;
    averageLikes: number;
    averageReviews: number;
    onLocaleChange: (locale: string) => void;
    onSeedChange: (seed: number) => void;
    onLikesChange: (likes: number) => void;
    onReviewsChange: (reviews: number) => void;
    onRandomSeed: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
    locale,
    seed,
    averageLikes,
    averageReviews,
    onLocaleChange,
    onSeedChange,
    onLikesChange,
    onReviewsChange,
    onRandomSeed
}) => {
    const locales = [
        { value: 'en-US', label: 'English (US)' },
        { value: 'de-DE', label: 'German (Germany)' },
        { value: 'ja-JP', label: 'Japanese (Japan)' }
    ];

    return (
        <div className="control-panel">
            <div className="control-group">
                <label htmlFor="locale-select">Language</label>
                <select 
                    id="locale-select"
                    value={locale} 
                    onChange={(e) => onLocaleChange(e.target.value)}
                    className="locale-select"
                >
                    {locales.map(loc => (
                        <option key={loc.value} value={loc.value}>
                            {loc.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="control-group">
                <label htmlFor="seed-input">Seed</label>
                <div className="seed-controls">
                    <input
                        id="seed-input"
                        type="number"
                        value={seed}
                        onChange={(e) => onSeedChange(parseInt(e.target.value) || 0)}
                        className="seed-input"
                    />
                    <button onClick={onRandomSeed} className="random-button">
                        🔀
                    </button>
                </div>
            </div>

            <div className="control-group">
                <label htmlFor="likes-slider">
                    Likes
                    <span className="value-display">{averageLikes}</span>
                </label>
                <Slider
                    id="likes-slider"
                    min={0}
                    max={10}
                    step={0.1}
                    value={averageLikes}
                    onChange={(value) => onLikesChange(value as number)}
                />
            </div>

            <div className="control-group">
                <label htmlFor="reviews-input">
                    Reviews
                </label>
                <input
                    id="reviews-input"
                    type="number"
                    min={0}
                    step={0.1}
                    value={averageReviews}
                    onChange={(e) => onReviewsChange(parseFloat(e.target.value) || 0)}
                    className="reviews-input"
                />
            </div>
        </div>
    );
};