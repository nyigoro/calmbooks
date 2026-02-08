import { Router } from "itty-router";
import { getBooks } from "./routes/books";

const router = Router();

router.get("/books", (req, env) => getBooks(req, env));

router.all("*", () =>
  new Response("Not Found", { status: 404 })
);

export default {
  async fetch(request, env) {
    return router.handle(request, env);
  },
};
