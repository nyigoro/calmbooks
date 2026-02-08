import { useState } from "react";

export default function Library({ onOpenBook }) {
  // Hardcoded book list for MVP
  const [books, setBooks] = useState([
    {
      id: 1,
      title: "Building a Calm Web Book Platform",
      description: "Notes & decisions about the platform",
    },
  ]);

  const [showNewBookForm, setShowNewBookForm] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState("");
  const [newBookDesc, setNewBookDesc] = useState("");

  const handleCreateBook = () => {
    if (!newBookTitle) return;
    const newBook = {
      id: books.length + 1,
      title: newBookTitle,
      description: newBookDesc,
    };
    setBooks([...books, newBook]);
    setNewBookTitle("");
    setNewBookDesc("");
    setShowNewBookForm(false);
  };

 const handleOpenBook = (book) => {
    if (onOpenBook) onOpenBook(book);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">My Library</h1>
      <div className="max-w-xl mx-auto space-y-4">
        {/* New Book Button & Form */}
        {/* Book List */}
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white p-4 rounded shadow cursor-pointer hover:shadow-md transition"
            onClick={() => handleOpenBook(book)}
          >
            <h2 className="text-xl font-semibold">{book.title}</h2>
            {book.description && (
              <p className="text-gray-600 mt-1">{book.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
