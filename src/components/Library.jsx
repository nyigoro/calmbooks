import { useEffect, useState } from "react";
import Book from "./Book";

export default function Library() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showNewBookForm, setShowNewBookForm] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState("");
  const [newBookDesc, setNewBookDesc] = useState("");

  // Fetch books from Worker API
  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/books");
      if (!res.ok) throw new Error("Failed to fetch books");
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Create a new book
  const handleCreateBook = async () => {
    if (!newBookTitle) return;

    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newBookTitle, description: newBookDesc }),
      });

      if (!res.ok) throw new Error("Failed to create book");
      const newBook = await res.json();
      setBooks([...books, newBook]);

      setNewBookTitle("");
      setNewBookDesc("");
      setShowNewBookForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  // Open Book component
  const handleOpenBook = (book) => {
    setSelectedBook(book);
  };

  // If a book is selected, show Book page
  if (selectedBook) {
    return <Book book={selectedBook} onBack={() => setSelectedBook(null)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Library</h1>

      <div className="max-w-xl mx-auto space-y-4">
        <button
          onClick={() => setShowNewBookForm(!showNewBookForm)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          {showNewBookForm ? "Cancel" : "New Book"}
        </button>

        {showNewBookForm && (
          <div className="bg-white p-4 rounded shadow space-y-2">
            <input
              type="text"
              placeholder="Book Title"
              value={newBookTitle}
              onChange={(e) => setNewBookTitle(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
            />
            <input
              type="text"
              placeholder="Short Description (optional)"
              value={newBookDesc}
              onChange={(e) => setNewBookDesc(e.target.value)}
              className="w-full border border-gray-300 rounded p-2"
            />
            <button
              onClick={handleCreateBook}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
            >
              Create Book
            </button>
          </div>
        )}

        {books.length === 0 && (
          <p className="text-gray-600 text-center">No books yet. Create one above!</p>
        )}

        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-md transition"
            onClick={() => handleOpenBook(book)}
          >
            <h2 className="text-xl font-semibold">{book.title}</h2>
            {book.description && <p className="text-gray-600 mt-1">{book.description}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
