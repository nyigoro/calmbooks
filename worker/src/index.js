import { Router } from 'itty-router';
import { jsonResponse } from './utils.js'; // helper for JSON responses

// Initialize router
const router = Router();

// --- BOOKS ROUTES ---

// GET /books - list all books
router.get('/books', async (req, env) => {
  try {
    const books = await env.DB.prepare('SELECT * FROM books').all();
    return jsonResponse(books.results || []);
  } catch (err) {
    console.error('GET /books error:', err);
    return jsonResponse({ error: err.message }, 500);
  }
});

// POST /books - add a new book
router.post('/books', async (req, env) => {
  try {
    const { title, description } = await req.json();
    const result = await env.DB.prepare(
      'INSERT INTO books (title, description) VALUES (?, ?) RETURNING *'
    ).bind(title, description).first();

    return jsonResponse(result);
  } catch (err) {
    console.error('POST /books error:', err);
    return jsonResponse({ error: err.message }, 500);
  }
});

// --- CHAPTERS ROUTES ---

// GET /books/:id/chapters - list chapters of a book
router.get('/books/:id/chapters', async (req, env) => {
  try {
    const { id } = req.params;
    const chapters = await env.DB.prepare(
      'SELECT * FROM chapters WHERE book_id = ?'
    ).bind(id).all();

    return jsonResponse(chapters.results || []);
  } catch (err) {
    console.error('GET /books/:id/chapters error:', err);
    return jsonResponse({ error: err.message }, 500);
  }
});

// POST /books/:id/chapters - add a chapter to a book
router.post('/books/:id/chapters', async (req, env) => {
  try {
    const { id } = req.params;
    const { title, content } = await req.json();

    const result = await env.DB.prepare(
      'INSERT INTO chapters (book_id, title, content) VALUES (?, ?, ?) RETURNING *'
    ).bind(id, title, content).first();

    return jsonResponse(result);
  } catch (err) {
    console.error('POST /books/:id/chapters error:', err);
    return jsonResponse({ error: err.message }, 500);
  }
});

// --- Default / Not Found ---
router.all('*', () => new Response('Not found', { status: 404 }));

// --- Fetch handler ---
export default {
  fetch: (req, env, ctx) => router.handle(req, { ...req, env }, ctx),
};
