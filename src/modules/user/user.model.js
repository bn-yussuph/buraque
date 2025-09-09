/**
 * Import required modules
 */
import mongoose from "mongoose"; // Mongoose library for MongoDB interactions
import sha1 from "sha1"; // SHA-1 hashing library for password encryption

/**
 * Define the Mongoose schema for the user model
 */
const Schema = mongoose.Schema;
const userSchema = new Schema({
  /**
   * User name
   */
  name: {
    type: String, // Data type for the name field
    required: true, // Whether the name field is required
    trim: true, // Trim whitespace from the name field
  },

  /**
   * User email
   */
  email: {
    type: String, // Data type for the email field
    required: true, // Whether the email field is required
    unique: true, // Ensure email addresses are unique
    trim: true, // Trim whitespace from the email field
  },

  /**
   * User password
   */
  password: {
    type: String, // Data type for the password field
    required: true, // Whether the password field is required
    trim: true, // Trim whitespace from the password field
  },

  /**
   * User role
   */
  role: {
    type: String, // Data type for the role field
    enum: ['admin', 'user'], // Allowable values for the role field
    default: 'user', // Default value for the role field
  },

  /**
   * User address
   */
  address: [{
    city: String, // City field for the address
    street: String, // Street field for the address
    phone: String, // Phone field for the address
  }],

  /**
   * User active status
   */
  active: {
    type: Boolean, // Data type for the active field
    default: true, // Default value for the active field
  },

  /**
   * User verified status
   */
  verified: {
    type: Boolean, // Data type for the verified field
    default: false, // Default value for the verified field
  },

  /**
   * User blocked status
   */
  blocked: {
    type: Boolean, // Data type for the blocked field
    default: false, // Default value for the blocked field
  },
}, {
  timestamps: true, // Automatically add createdAt and updatedAt fields
});

/**
 * Pre-save hook to hash the user password
 */
userSchema.pre("save", function () {
  this.password = sha1(this.password);
});

/**
 * Create the Mongoose model for the user schema
 */
const userModel = mongoose.model('user', userSchema);

/**
 * Export the user model
 */
export default userModel;