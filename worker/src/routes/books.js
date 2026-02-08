export async function getBooks(request, env) {
  try {
    const { results } = await env.DB
      .prepare("SELECT * FROM books ORDER BY created_at DESC")
      .all();

    return new Response(JSON.stringify(results), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (err) {
    console.error("GET /books error:", err);

    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500 }
    );
  }
}
