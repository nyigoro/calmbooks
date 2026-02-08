import { useState } from "react";

export default function Book({ book, onBack }) {
  const [mode, setMode] = useState("read");
  const [chapters, setChapters] = useState([
    {
      id: 1,
      title: "Introduction",
      content:
        "This platform exists to create a calm, minimal web environment where you can write and read books. It also serves developers as a place for documentation.",
    },
    {
      id: 2,
      title: "Library Foundation",
      content:
        "The Library is the root of all books. It lists existing books and allows creation of new ones. Every navigation begins here.",
    },
    {
      id: 3,
      title: "Book Page",
      content:
        "Each book has Read and Edit modes. Read mode shows chapters cleanly, while Edit mode allows adding and updating chapters.",
    },
    {
      id: 4,
      title: "Next Steps",
      content:
        "Future chapters will include advanced features: persistent storage, developer docs, search, and user settings. But for now, we keep it minimal.",
    },
  ]);

  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [newChapterContent, setNewChapterContent] = useState("");

  const handleAddChapter = () => {
    if (!newChapterTitle) return;
    const newChapter = {
      id: chapters.length + 1,
      title: newChapterTitle,
      content: newChapterContent,
    };
    setChapters([...chapters, newChapter]);
    setNewChapterTitle("");
    setNewChapterContent("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Back button */}
      <button
        onClick={onBack}
        className="mb-4 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition"
      >
        ← Back to Library
      </button>

      {/* Book title */}
      <h1 className="text-3xl font-bold mb-4">{book.title}</h1>

      {/* Mode toggle */}
      <button
        onClick={() => setMode(mode === "read" ? "edit" : "read")}
        className="mb-6 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
      >
        Switch to {mode === "read" ? "Edit" : "Read"} Mode
      </button>

      {/* Chapters */}
      {mode === "read" ? (
        <div className="space-y-6">
          {chapters.map((ch) => (
            <div key={ch.id} className="bg-white p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{ch.title}</h2>
              <p className="mt-2 text-gray-700">{ch.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 max-w-xl">
          {chapters.map((ch) => (
            <div key={ch.id} className="bg-white p-4 rounded shadow">
              <input
                className="w-full font-semibold border-b border-gray-300 p-1"
                value={ch.title}
                onChange={(e) => {
                  const updatedChapters = chapters.map((c) =>
                    c.id === ch.id ? { ...c, title: e.target.value } : c
                  );
                  setChapters(updatedChapters);
                }}
              />
              <textarea
                className="w-full border p-2 mt-2 rounded"
                value={ch.content}
                onChange={(e) => {
                  const updatedChapters = chapters.map((c) =>
                    c.id === ch.id ? { ...c, content: e.target.value } : c
                  );
                  setChapters(updatedChapters);
                }}
              />
            </div>
          ))}

          {/* New chapter form */}
          <div className="bg-white p-4 rounded shadow space-y-2">
            <input
              type="text"
              placeholder="New Chapter Title"
              value={newChapterTitle}
              onChange={(e) => setNewChapterTitle(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <textarea
              placeholder="New Chapter Content"
              value={newChapterContent}
              onChange={(e) => setNewChapterContent(e.target.value)}
              className="w-full border p-2 rounded"
            />
            <button
              onClick={handleAddChapter}
              className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
            >
              Add Chapter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
