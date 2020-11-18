import React, { useEffect, useState } from "react";
import { getBooksByType } from "./book-search.service";
import useDebounce from '../use-debounce';
import '../styles/book-search.scss';


const BookSearch = () => {
    const [bookType, updateBookType] = useState("");
    const [bookTypeToSearch, updateBookTypeToSearch] = useState("");
    const [allAvailableBooks, setAllAvailableBooks] = useState([] as any);
    const [authors, setAuthors] = useState([] as any);
    const debouncedSearchTerm = useDebounce(bookType, 500);
    async function requestBooks() {
        
        if (bookTypeToSearch) {
            const allBooks = await getBooksByType(bookTypeToSearch);
            const { items } = allBooks;
            setAllAvailableBooks(items);
        }
    }

    useEffect(() => {
        async function getAllBooks() {
            await requestBooks();
        }
        getAllBooks();
    }, [bookTypeToSearch]);
    useEffect(
        () => {
            if (debouncedSearchTerm) {
                getBooksByType(debouncedSearchTerm).then(results => {
                    const { items } = results;
                    setAllAvailableBooks(items);
                });
            } else {
                setAllAvailableBooks([]);
            }
        },
        [debouncedSearchTerm]
    );
    const handleClick = (name: string) => {
        if (!authors.includes(name)) {
            const bookTitles = [...authors, name]
            setAuthors(bookTitles);
        }
    }
    return (
        <>
            <div className="book--container">
                <div className="search-params">
                    <div>
                        <form data-testid='form'
                            onSubmit={(e) => {
                                updateBookTypeToSearch(bookType)
                            }}
                        >
                            <input
                                className="full-width"
                                autoFocus
                                name="gsearch"
                                type="search"
                                value={bookType}
                                data-testid="add-search"
                                placeholder="Search for books to add to your reading list and press Enter"
                                onChange={e => updateBookType(e.target.value)}
                            />
                        </form>
                        {!bookType && (
                                <div className="empty">
                                    <p>
                                        Try searching for a topic, for example
                                        <a data-testid='empty-booktype' onClick={() => {
                                                updateBookType("Javascript");
                                            }}
                                        >
                                            {" "}
                                            "Javascript"
                                        </a>
                                    </p>
                                </div>
                            )}


                        {bookType && <div className="book-details-info">
                            {allAvailableBooks && allAvailableBooks.map((book: any, ind: number) =>
                                <div className="each-book" key={ind}>
                                    <div className="book-info" >
                                        <p className="title">
                                            {book.volumeInfo.title}
                                        </p>
                                        <p className="author">
                                            <label>Author: </label>
                                            <span>{book.volumeInfo.authors}</span>
                                        </p>
                                        <p className="publisher">
                                            <label>Publisher: </label>
                                            <span>{book.volumeInfo.publisher}</span>
                                        </p>
                                        <p className="published">
                                            <label>Published: </label>
                                            <span>{book.volumeInfo.publishedDate}</span>
                                        </p>
                                        <p className="Description">
                                            <label>Description: </label>
                                            <span>{book.volumeInfo.description}</span>
                                        </p>
                                    </div>
                                    <div className="book-img">
                                        {book.volumeInfo.imageLinks && <img src={book.volumeInfo.imageLinks.thumbnail} alt="book" />}
                                        <div className="add-to-cart">
                                        <button data-testid="add-cart" onClick={() => handleClick(book.volumeInfo.title)}>Add Book</button>
                                    </div>
                                    </div>
                                    
                                </div>
                            )}
                            {!allAvailableBooks && <div className="no-results-found">No Books Found!</div>}
                        </div>
                   
                            }</div>
                </div>
                <div className="wish-list">
                    <p><span>My Reading WishList <span>( {authors.length} )</span></span></p>
                    { authors && authors.length > 0 && <div className="selected-books">
                        {authors && authors.map((title: string, ind: number) =>
                            <p key={ind} className="selected-book-names">{title}</p>)}
                    </div> }
                </div>
            </div>
        </>
    );
};

export default BookSearch;
