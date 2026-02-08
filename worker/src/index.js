export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // GET /books → list all books
    if (request.method === "GET" && url.pathname === "/books") {
      const result = await env.DB.prepare("SELECT * FROM books ORDER BY id").all();
      return new Response(JSON.stringify(result.results), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // POST /books → create new book
    if (request.method === "POST" && url.pathname === "/books") {
      const data = await request.json();
      if (!data.title) {
        return new Response(JSON.stringify({ error: "Title required" }), { status: 400 });
      }
      const result = await env.DB.prepare(
        "INSERT INTO books (title, description) VALUES (?, ?) RETURNING *"
      )
        .bind(data.title, data.description || "")
        .first();
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response("Not found", { status: 404 });
  },
};
