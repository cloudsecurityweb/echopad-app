import express from "express";
import { getProducts } from "../controllers/userProduct.controller.js";
import { detectAuthProvider } from "./auth.js";

const router = express.Router();

router.get("/", detectAuthProvider, getProducts);

export default router;
