import paystack from "../../utils/payments/paystack.js";
import transactionModel from "./transaction.model.js";

class WalletController {
    TransactionStatus = Object.freeze({
        INITIATED: 'INITIATED',
        PENDING: 'PENDING',
        COMPLETED: 'COMPLETED',
        FAILED: 'FAILED',
        REJECTED: 'REJECTED'
    });
    async loadWallet(req, res) {
        // const user_id = req.user._id;
        // const wallet_id = req.user.wallet_id._id;
        // console.log(wallet_id);
        const wallet_id = "6910417a59da0521b877ca59";
        const transaction = await transactionModel.
            create({ wallet_id: wallet_id, transaction_type: 'WALLET_RECHARGE' });

        const paystackClient = paystack.getPaystackClient();
        const pay = await paystackClient.transaction.initialize({
            email: "hajjaj@yahoo.com",
            amount: 2000,
            callback_url: `http://localhost:5000/api/wallet/verify_payment/${transaction._id}`,
            metadata: {
                transaction_id: transaction._id,
                wallet_id: wallet_id
            }
        });
        // console.log(pay);
        await transactionModel.findByIdAndUpdate(transaction._id, { reference_id: pay.data.reference, status: 'PENDING' });
        res.redirect(pay.data.authorization_url);
    }

    async verifyPayment(req, res) {
        const { transaction_id } = req.params;
        // console.log("Verifying payment for transaction ID:", transaction_id);
        // console.log(req.params);
        const transaction = await transactionModel.findById(transaction_id);
        if (!transaction) {
            return res.status(404).json({ error: "Transaction not found" });
        }
        // console.log("reference_id: ", transaction.reference_id);
        const paystackClient = paystack.getPaystackClient();
        const verify = await paystackClient.transaction.verify({ reference: transaction.reference_id });
        console.log(verify);
        await transactionModel.findByIdAndUpdate(transaction_id, { status: 'COMPLETED' });
        res.status(201).json({ message: "Payment verified successfully" });
    }

    async getAllTransactions(req, res) {
        const transactions = await transactionModel.find();
        const response = { message: "Success", transacions: transactions };
        res.status(201).json(response);
    }
}

const walletController = new WalletController();

export default walletController;