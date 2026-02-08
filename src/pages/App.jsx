import { useState } from "react";
import Library from "../components/Library";
import Book from "../components/Book";

export default function App() {
  const [currentBook, setCurrentBook] = useState(null);

  return (
    <div>
      {currentBook ? (
        <Book book={currentBook} onBack={() => setCurrentBook(null)} />
      ) : (
        <Library onOpenBook={setCurrentBook} />
      )}
    </div>
  );
}
