/**
 * Import required modules
 */
import { createClient } from 'redis';

/**
 * Define a class to manage the Redis client
 */
class RedisClient {
  /**
   * Constructor to initialize the Redis client
   */
  constructor() {
    /**
     * Create a new Redis client instance
     */
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });

    /**
     * Handle Redis client errors
     */
    this.client.on('error', (err) => console.error('Redis Client Error:', err));

    /**
     * Establish a connection to the Redis server
     */
    this.client.connect().catch((err) => console.error('Redis Connect Error:', err));
  }

  /**
   * Check if the Redis client is alive
   * 
   * @returns {boolean} True if the client is alive, false otherwise
   */
  isAlive() {
    return this.client.isOpen;
  }

  /**
   * Retrieve a value from Redis by key
   * 
   * @async
   * @param {string} key - The key to retrieve
   * @returns {Promise<string|null>} The retrieved value, or null on error
   */
  async get(key) {
    try {
      const value = await this.client.get(key);
      console.log("Redis GET operation successful");
      return value;
    } catch (err) {
      console.error("Redis GET operation error: ", err)
      return null;
    }
  }

  /**
   * Set a value in Redis by key
   * 
   * @async
   * @param {string} key - The key to set
   * @param {any} val - The value to set
   * @param {number} duration - The expiration time in seconds
   */
  async set(key, val, duration) {
    try {
      await this.client.set(key, String(val), { EX: duration });
      console.log("Redis SET operation successful");
    } catch (err) {
      console.error("Redis SET operation error: ", err)
    }
  }

  /**
   * Delete a key-value pair from Redis
   * 
   * @async
   * @param {string} key - The key to delete
   */
  async del(key) {
    try {
      await this.client.del(key);
      console.log("Redis DEL operation successful");
    } catch (err) {
      console.error("Redis DEL operation error: ", err)
    }
  }
}

/**
 * Create a new instance of the RedisClient class
 */
const redisClient = new RedisClient();

/**
 * Export the RedisClient instance
 */
export default redisClient;