/**
 * Import required modules
 */
import mongoose from 'mongoose';
import dotenv from 'dotenv';

/**
 * Load environment variables from .env file
 */
dotenv.config();

/**
 * Define a class to manage the database connection
 */
class DBClient {
  /**
   * Constructor to initialize the database client
   */
  constructor() {
    /**
     * Flag to track the connection status
     */
    this.isConnected = false;
  }

  /**
   * Establish a connection to the MongoDB database
   * 
   * @async
   */
  async connect() {
    /**
     * Get the database host, port, and name from environment variables
     */
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const dbName = process.env.DB_DATABASE || 'buraque';

    /**
     * Construct the MongoDB connection URI
     */
    const uri = `mongodb://${host}:${port}/${dbName}`;

    console.log(uri);

    try {
      /**
       * Establish a connection to the MongoDB database
       */
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });

      /**
       * Update the connection status flag
       */
      this.isConnected = true;

      console.log('MongoDB Connection Successful...');
    } catch (err) {
      /**
       * Update the connection status flag on error
       */
      this.isConnected = false;

      console.error('MongoDB Connection Error:', err);
    }
  }

  /**
   * Check if the database connection is alive
   * 
   * @returns {boolean} True if the connection is alive, false otherwise
   */
  isAlive() {
    return this.isConnected && mongoose.connection.readyState === 1;
  }
}

/**
 * Create a new instance of the DBClient class
 */
const dbClient = new DBClient();

/**
 * Export the DBClient instance
 */
export default dbClient;