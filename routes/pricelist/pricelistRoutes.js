import { Router } from "express";
import {
  getAllProducts,
  getProductByTitle,
  updateProductByTitle
} from "../../controller/pricelistController.js";
import {authRequired} from "../../middleware/authMiddleware.js";

const pricelistRoutes = Router();

// GET all products
pricelistRoutes.get("/", authRequired, getAllProducts);

// GET product by title
pricelistRoutes.get("/:title", authRequired, getProductByTitle);

// PUT update product by title
pricelistRoutes.put("/update", authRequired, updateProductByTitle);

export default pricelistRoutes;
