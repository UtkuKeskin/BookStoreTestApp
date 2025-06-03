import React, { useState, useEffect, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Book } from '../../types/Book';
import { bookApi } from '../../services/bookApi';
import { BookCard } from '../BookCard';
import './GalleryView.css';

interface GalleryViewProps {
    locale: string;
    seed: number;
    averageLikes: number;
    averageReviews: number;
    onBookCountChange?: (count: number) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
    locale,
    seed,
    averageLikes,
    averageReviews,
    onBookCountChange
}) => {
    const [books, setBooks] = useState<Book[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadMoreBooks = useCallback(async () => {
        if (loading) return;
        
        setLoading(true);
        setError(null);
        
        try {
            const nextStart = books.length;
            const newBooks = await bookApi.getBooks({
                locale,
                seed,
                averageLikes,
                averageReviews,
                start: nextStart,
                count: 12
            });

            if (newBooks.length > 0) {
                const expectedIndex = nextStart + 1;
                if (newBooks[0].absoluteIndex === expectedIndex) {
                    setBooks(prevBooks => {
                        const updatedBooks = [...prevBooks, ...newBooks];
                        onBookCountChange?.(updatedBooks.length);
                        return updatedBooks;
                    });
                } else {
                    console.error('Batch order mismatch!');
                    setError('Data order error. Please refresh.');
                }
            }

            if (newBooks.length < 12) {
                setHasMore(false);
            }
        } catch (err) {
            console.error('Error loading books:', err);
            setError('Failed to load books. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [books.length, locale, seed, averageLikes, averageReviews, loading]);

    const loadInitialBooks = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const initialBooks = await bookApi.getBooks({
                locale,
                seed,
                averageLikes,
                averageReviews,
                start: 0,
                count: 24
            });
            
            setBooks(initialBooks);
            setHasMore(initialBooks.length === 24);
            onBookCountChange?.(initialBooks.length);
        } catch (err) {
            console.error('Error loading initial books:', err);
            setError('Failed to load books. Please check if the server is running.');
        } finally {
            setLoading(false);
        }
    }, [locale, seed, averageLikes, averageReviews]);

    useEffect(() => {
        setBooks([]);
        setHasMore(true);
        loadInitialBooks();
    }, [locale, seed, averageLikes, averageReviews, loadInitialBooks]);

    if (error && books.length === 0) {
        return (
            <div className="error-container">
                <p className="error-message">{error}</p>
                <button onClick={loadInitialBooks} className="retry-button">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="gallery-container">
            <InfiniteScroll
                dataLength={books.length}
                next={loadMoreBooks}
                hasMore={hasMore}
                loader={
                    <div className="loader">
                        <span>Loading more books...</span>
                    </div>
                }
                endMessage={
                    <div className="end-message">
                        <p>No more books to load</p>
                    </div>
                }
            >
                <div className="gallery-grid">
                    {books.map((book) => (
                        <BookCard key={book.absoluteIndex} book={book} />
                    ))}
                </div>
            </InfiniteScroll>
            
            {error && books.length > 0 && (
                <div className="error-banner">
                    {error}
                </div>
            )}
        </div>
    );
};