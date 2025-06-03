import React, { useEffect, useRef } from 'react';
import seedrandom from 'seedrandom';
import { Book } from '../../types/Book';
import './BookDetails.css';

interface BookDetailsProps {
    book: Book;
}

export const BookDetails: React.FC<BookDetailsProps> = ({ book }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        generateBookCover();
    }, [book]);

    const generateBookCover = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rng = seedrandom(book.isbn);

        const hue = Math.floor(rng() * 360);
        const saturation = 40 + Math.floor(rng() * 30);
        const lightness = 30 + Math.floor(rng() * 40);
        ctx.fillStyle = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const patternType = Math.floor(rng() * 3);
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = 'white';
        
        switch (patternType) {
            case 0:
                for (let i = 0; i < 20; i++) {
                    const x = rng() * canvas.width;
                    const y = rng() * canvas.height;
                    const radius = 10 + rng() * 30;
                    ctx.beginPath();
                    ctx.arc(x, y, radius, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;
            case 1:
                ctx.strokeStyle = 'white';
                ctx.lineWidth = 2;
                for (let i = 0; i < 15; i++) {
                    ctx.beginPath();
                    ctx.moveTo(0, rng() * canvas.height);
                    ctx.lineTo(canvas.width, rng() * canvas.height);
                    ctx.stroke();
                }
                break;
            case 2:
                for (let i = 0; i < 10; i++) {
                    const x = rng() * canvas.width;
                    const y = rng() * canvas.height;
                    const size = 20 + rng() * 40;
                    ctx.fillRect(x, y, size, size);
                }
                break;
        }

        ctx.globalAlpha = 1;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, canvas.height - 120, canvas.width, 120);

        ctx.fillStyle = 'white';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        const titleLines = wrapText(ctx, book.title, canvas.width - 40);
        titleLines.forEach((line, index) => {
            ctx.fillText(line, canvas.width / 2, canvas.height - 80 + index * 25);
        });

        ctx.font = '14px Arial';
        ctx.fillStyle = '#ccc';
        const authorsText = book.authors.join(', ');
        ctx.fillText(authorsText, canvas.width / 2, canvas.height - 20);
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
        <div className="book-details">
            <div className="book-cover-section">
                <canvas 
                    ref={canvasRef} 
                    width={200} 
                    height={300}
                    className="book-cover"
                />
            </div>
            
            <div className="book-info-section">
                <div className="info-group">
                    <h3>Book Information</h3>
                    <p><strong>ISBN:</strong> {book.isbn}</p>
                    <p><strong>Publisher:</strong> {book.publisher}</p>
                    <p><strong>Likes:</strong> {book.likes} ❤️</p>
                </div>

                {book.reviews.length > 0 && (
                    <div className="reviews-section">
                        <h3>Reviews ({book.reviews.length})</h3>
                        <div className="reviews-list">
                            {book.reviews.map((review, index) => (
                                <div key={index} className="review-item">
                                    <p className="review-text">"{review.text}"</p>
                                    <p className="review-author">— {review.author}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};