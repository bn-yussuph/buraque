import express from "express";
import walletController from "./wallet.controller.js";

const walletRoutes = express.Router();

walletRoutes.get("/", walletController.getAllTransactions);
walletRoutes.post("/load_wallet", walletController.loadWallet);
walletRoutes.get("/verify_payment/:transaction_id", walletController.verifyPayment);

export default walletRoutes;
