import express from "express";
import { searchContent } from "../controllers/searchController.js";

export const searchRoute = express.Router();
searchRoute.get("/", searchContent);
