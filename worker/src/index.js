import { Router } from "itty-router";
import { getBooks } from "./routes/books";

const router = Router();

// ✅ handle both paths
router.get("/books", (req, env) => getBooks(req, env));
router.get("/api/books", (req, env) => getBooks(req, env));

// ✅ hard fallback (prevents hangs)
router.all("*", () =>
  new Response(JSON.stringify({ error: "Route not found" }), {
    status: 404,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  })
);

export default {
  async fetch(request, env, ctx) {
    return router.handle(request, env, ctx);
  },
};
