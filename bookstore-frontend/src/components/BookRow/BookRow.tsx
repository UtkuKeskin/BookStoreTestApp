import React, { useState } from 'react';
import { Book } from '../../types/Book';
import { BookDetails } from '../BookDetails';
import './BookRow.css';

interface BookRowProps {
    book: Book;
}

export const BookRow: React.FC<BookRowProps> = ({ book }) => {
    const [expanded, setExpanded] = useState(false);

    const handleClick = () => {
        setExpanded(!expanded);
    };

    return (
        <>
            <tr className="book-row" onClick={handleClick}>
                <td>{book.absoluteIndex}</td>
                <td>{book.isbn}</td>
                <td>{book.title}</td>
                <td>{book.authors.join(', ')}</td>
                <td>{book.publisher}</td>
            </tr>
            {expanded && (
                <tr className="book-details-row">
                    <td colSpan={5}>
                        <BookDetails book={book} />
                    </td>
                </tr>
            )}
        </>
    );
};