export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);

      // ---- GET /api/books ----
      if (request.method === "GET" && url.pathname === "/api/books") {
        const { results } = await env.DB
          .prepare("SELECT id, title, description FROM books")
          .all();

        return new Response(JSON.stringify(results), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      // ---- fallback ----
      return new Response(
        JSON.stringify({ error: "Not found" }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    } catch (err) {
      return new Response(
        JSON.stringify({
          error: "Worker exception",
          message: err.message,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }
  },
};
