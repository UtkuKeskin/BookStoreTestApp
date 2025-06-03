import React, { useEffect, useRef, useState } from 'react';
import seedrandom from 'seedrandom';
import { Book } from '../../types/Book';
import './BookCard.css';

interface BookCardProps {
    book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [showDetails, setShowDetails] = useState(false);

    useEffect(() => {
        generateBookCover();
    }, [book]);

    const generateBookCover = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rng = seedrandom(book.isbn);
        
        // Random background color
        const hue = Math.floor(rng() * 360);
        const saturation = 40 + Math.floor(rng() * 30);
        const lightness = 30 + Math.floor(rng() * 40);
        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add pattern
        const patternType = Math.floor(rng() * 3);
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = 'white';
        
        switch (patternType) {
            case 0: // Circles
                for (let i = 0; i < 15; i++) {
                    const x = rng() * canvas.width;
                    const y = rng() * canvas.height;
                    const radius = 10 + rng() * 20;
                    ctx.beginPath();
                    ctx.arc(x, y, radius, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
            case 1: // Lines
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 2;
                for (let i = 0; i < 10; i++) {
                    ctx.beginPath();
                    ctx.moveTo(0, rng() * canvas.height);
                    ctx.lineTo(canvas.width, rng() * canvas.height);
                    ctx.stroke();
                }
                break;
            case 2: // Squares
                for (let i = 0; i < 8; i++) {
                    const x = rng() * canvas.width;
                    const y = rng() * canvas.height;
                    const size = 15 + rng() * 30;
                    ctx.fillRect(x, y, size, size);
                }
                break;
        }

        ctx.globalAlpha = 1;

        // Title background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, canvas.height - 80, canvas.width, 80);

        // Title text
        ctx.fillStyle = 'white';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        const titleLines = wrapText(ctx, book.title, canvas.width - 20);
        titleLines.forEach((line, index) => {
            ctx.fillText(line, canvas.width / 2, canvas.height - 50 + index * 20);
        });

        // Authors
        ctx.font = '12px Arial';
        ctx.fillStyle = '#ccc';
        const authorsText = book.authors[0] || 'Unknown';
        ctx.fillText(authorsText, canvas.width / 2, canvas.height - 10);
    };

    const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] => {
        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        for (const word of words) {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        
        if (currentLine) {
            lines.push(currentLine);
        }
        
        return lines.slice(0, 2);
    };

    return (
        <div className="book-card" onClick={() => setShowDetails(!showDetails)}>
            <canvas 
                ref={canvasRef} 
                width={200} 
                height={280}
                className="book-card-cover"
            />
            
            <div className="book-card-info">
                <p className="book-card-isbn">{book.isbn}</p>
                <p className="book-card-publisher">{book.publisher}</p>
                <div className="book-card-stats">
                    <span>❤️ {book.likes}</span>
                    <span>💬 {book.reviews.length}</span>
                </div>
            </div>

            {showDetails && (
                <div className="book-card-details">
                    <h4>Reviews</h4>
                    {book.reviews.length > 0 ? (
                        <div className="book-card-reviews">
                            {book.reviews.slice(0, 2).map((review, index) => (
                                <div key={index} className="review-mini">
                                    <p>"{review.text.substring(0, 100)}..."</p>
                                    <p className="review-mini-author">— {review.author}</p>
                                </div>
                            ))}
                            {book.reviews.length > 2 && (
                                <p className="more-reviews">+{book.reviews.length - 2} more reviews</p>
                            )}
                        </div>
                    ) : (
                        <p className="no-reviews">No reviews yet</p>
                    )}
                </div>
            )}
        </div>
    );
};