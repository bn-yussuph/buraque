/**
 * Import required modules
 */
import mongoose from "mongoose"; // Mongoose library for MongoDB interactions
/**
 * Define the Mongoose schema for the wallet model
 */
const Schema = mongoose.Schema;
const walletSchema = new Schema({

  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    enum: ['GHC', 'US$'],
    default: 'GHC'
  },
  
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

/**
 * Create the Mongoose model for the wallet schema
 */
const walletModel = mongoose.model('wallet', walletSchema);

/**
 * Export the user model
 */
export default walletModel;