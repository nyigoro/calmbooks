export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);

  // GET /books - list all books
  if (request.method === "GET" && url.pathname === "/books") {
    const result = await env.DB.prepare("SELECT * FROM books").all();
    return new Response(JSON.stringify(result.results), { headers: { "Content-Type": "application/json" } });
  }

  // POST /books - create new book
  if (request.method === "POST" && url.pathname === "/books") {
    const data = await request.json();
    const result = await env.DB.prepare(
      "INSERT INTO books (title, description) VALUES (?, ?) RETURNING *"
    )
      .bind(data.title, data.description)
      .first();
    return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } });
  }

  // GET /books/:id/chapters - list chapters of a book
  if (request.method === "GET" && url.pathname.startsWith("/books/") && url.pathname.endsWith("/chapters")) {
    const bookId = url.pathname.split("/")[2];
    const result = await env.DB.prepare("SELECT * FROM chapters WHERE book_id = ? ORDER BY id").bind(bookId).all();
    return new Response(JSON.stringify(result.results), { headers: { "Content-Type": "application/json" } });
  }

  // POST /books/:id/chapters - add chapter to a book
  if (request.method === "POST" && url.pathname.startsWith("/books/") && url.pathname.endsWith("/chapters")) {
    const bookId = url.pathname.split("/")[2];
    const data = await request.json();
    const result = await env.DB.prepare(
      "INSERT INTO chapters (book_id, title, content) VALUES (?, ?, ?) RETURNING *"
    )
      .bind(bookId, data.title, data.content)
      .first();
    return new Response(JSON.stringify(result), { headers: { "Content-Type": "application/json" } });
  }

  return new Response("Not found", { status: 404 });
}
