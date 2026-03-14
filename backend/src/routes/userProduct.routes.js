import express from "express";
import { getProducts } from "../controllers/userProduct.controller.js";
import { detectAuthProvider } from "./auth.js";
import rateLimit from "express-rate-limit";

const router = express.Router();
const userProductLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

router.use(userProductLimiter);

router.get("/", detectAuthProvider, getProducts);

export default router;
