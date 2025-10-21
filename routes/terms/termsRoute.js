import { Router } from "express";
import { getTerms } from "../../controller/termsController.js";

const termsRoutes = Router();

termsRoutes.get("/", getTerms);

export default termsRoutes;