export interface Book {
    absoluteIndex: number;
    isbn: string;
    title: string;
    authors: string[];
    publisher: string;
    likes: number;
    reviews: Review[];
}

export interface Review {
    text: string;
    author: string;
}