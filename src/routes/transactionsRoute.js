import express from "express";
import { sql } from "../config/db.js";
import { getTransactionsByUserId, CreateTransaction, getSummaryByUserId, DeleteTransaction } from "../controllers/transactionController.js";

const router = express.Router();


router.get("/:userId", getTransactionsByUserId);

router.post("/", CreateTransaction);

router.get("/summary/:userId", getSummaryByUserId);

router.delete("/:id", DeleteTransaction);

export default router;