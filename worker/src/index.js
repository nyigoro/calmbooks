// worker/src/index.js
import { Router } from 'itty-router'

// Create router
const router = Router()

// Health check
router.get('/health', () => new Response('OK'))

// GET all books
router.get('/books', async (req, env) => {
  try {
    const res = await env.DB.prepare('SELECT * FROM books').all()
    // res.results is an array of rows
    return new Response(JSON.stringify(res.results), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Error fetching books:', err)
    return new Response(JSON.stringify({ error: 'Failed to fetch books' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})

// GET chapters for a specific book
router.get('/books/:id/chapters', async (req, env) => {
  try {
    const { id } = req.params
    const res = await env.DB
      .prepare('SELECT * FROM chapters WHERE book_id = ?')
      .bind(id)
      .all()

    if (!res.results.length) {
      return new Response(JSON.stringify({ error: 'No chapters found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify(res.results), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Error fetching chapters:', err)
    return new Response(JSON.stringify({ error: 'Failed to fetch chapters' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})

// Catch-all for undefined routes
router.all('*', () => new Response('Not found', { status: 404 }))

// Export fetch handler for Worker
export default {
  async fetch(request, env) {
    return router.handle(request, env)
  },
}
