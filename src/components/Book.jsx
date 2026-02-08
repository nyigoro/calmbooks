import { useState, useEffect } from "react";

export default function Book({ book, onBack }) {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [newChapterContent, setNewChapterContent] = useState("");

  // Fetch chapters for this book
  const fetchChapters = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/books/${book.id}/chapters`);
      const data = await res.json();
      setChapters(data);
    } catch (err) {
      console.error("Failed to fetch chapters:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, [book]);

  // Add new chapter
  const handleAddChapter = async () => {
    if (!newChapterTitle) return;
    try {
      const res = await fetch(`/api/books/${book.id}/chapters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newChapterTitle,
          content: newChapterContent,
        }),
      });
      const createdChapter = await res.json();
      setChapters([...chapters, createdChapter]);
      setNewChapterTitle("");
      setNewChapterContent("");
    } catch (err) {
      console.error("Failed to add chapter:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button
        onClick={onBack}
        className="mb-4 bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition"
      >
        ← Back to Library
      </button>

      <h1 className="text-3xl font-bold mb-4">{book.title}</h1>

      {/* Chapters List */}
      <div className="space-y-4 max-w-xl mx-auto">
        {loading ? (
          <p className="text-gray-500 text-center">Loading chapters...</p>
        ) : chapters.length === 0 ? (
          <p className="text-gray-500 text-center">No chapters yet.</p>
        ) : (
          chapters.map((chapter) => (
            <div
              key={chapter.id}
              className="bg-white p-4 rounded shadow hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold">{chapter.title}</h2>
              <p className="mt-1 text-gray-600">{chapter.content}</p>
            </div>
          ))
        )}
      </div>

      {/* Add New Chapter */}
      <div className="max-w-xl mx-auto mt-6 p-4 bg-white rounded shadow space-y-2">
        <input
          type="text"
          placeholder="Chapter Title"
          value={newChapterTitle}
          onChange={(e) => setNewChapterTitle(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        />
        <textarea
          placeholder="Chapter Content"
          value={newChapterContent}
          onChange={(e) => setNewChapterContent(e.target.value)}
          className="w-full border border-gray-300 rounded p-2"
        />
        <button
          onClick={handleAddChapter}
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
        >
          Add Chapter
        </button>
      </div>
    </div>
  );
}
