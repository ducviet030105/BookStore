import express from "express"
import { createBook, deleteBook, getAllBook, getUserBook } from "../controlller/BookController.js";
import protectRoute from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/",protectRoute,  createBook)
router.get("/", protectRoute, getAllBook)
router.delete('/:id', protectRoute, deleteBook)
router.get("/user", protectRoute, getUserBook);
export default router