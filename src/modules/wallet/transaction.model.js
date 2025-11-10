/**
 * Import required modules
 */
import mongoose from "mongoose"; // Mongoose library for MongoDB interactions
/**
 * Define the Mongoose schema for the user model
 */
const Schema = mongoose.Schema;
const transactionSchema = new Schema({

  wallet_id: {
    type: mongoose.Schema.ObjectId,
    ref: "wallet",
    required: true
  },
  amount: {
    type: Number,
    default: 0
  },
  transaction_type: {
    type: String,
    enum: ['CREDIT', 'DEBIT'],
  },
  status: {
    type: String,
    enum: ['INITIATED', 'PENDING', 'COMPLETED', 'REJECTED'],
    default: 'INITIATED'
  },
  reference_id: {
    type: String,
  },
  description: {
    type: String
  }
  
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});


/**
 * Create the Mongoose model for the transaction schema
 */
const transactionModel = mongoose.model('transaction', transactionSchema);

/**zz
 * Export the user model
 */
export default transactionModel;