import { Router } from 'itty-router';
import { jsonResponse } from './utils.js'; // helper for JSON responses

// Initialize router
const router = Router();

// --- BOOKS ROUTES ---

// GET /books - list all books
router.get('/books', async (req, env) => {
  const books = await env.DB.prepare('SELECT * FROM books').all();
  return jsonResponse(books.results || []);
});

// POST /books - add a new book
router.post('/books', async (req, env) => {
  const { title, author } = await req.json();
  const result = await env.DB.prepare(
    'INSERT INTO books (title, author) VALUES (?, ?)'
  ).run(title, author);

  return jsonResponse({ id: result.lastInsertRowid, title, author });
});

// --- CHAPTERS ROUTES ---

// GET /books/:id/chapters - list chapters of a book
router.get('/books/:id/chapters', async (req, env) => {
  const { id } = req.params;
  const chapters = await env.DB.prepare(
    'SELECT * FROM chapters WHERE bookId = ?'
  ).all(id);

  return jsonResponse(chapters.results || []);
});

// POST /books/:id/chapters - add a chapter to a book
router.post('/books/:id/chapters', async (req, env) => {
  const { id } = req.params;
  const { title, content } = await req.json();

  const result = await env.DB.prepare(
    'INSERT INTO chapters (bookId, title, content) VALUES (?, ?, ?)'
  ).run(id, title, content);

  return jsonResponse({
    id: result.lastInsertRowid,
    bookId: id,
    title,
    content,
  });
});

// --- Default / Not Found ---
router.all('*', () => new Response('Not found', { status: 404 }));

// --- Fetch handler ---
export default {
  fetch: (req, env) => router.handle(req, env),
};
