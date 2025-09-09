/**
 * Import required modules
 */
import userModel from "../user/user.model.js";
import sha1 from "sha1";
import { v4 } from "uuid";
import redisClient from "../../utils/redis.js";

/**
 * Define a class to manage authentication
 */
class AuthController {
  /**
   * Handle user sign-up
   * 
   * @async
   * @param {Express.Request} req - The incoming request
   * @param {Express.Response} res - The outgoing response
   */
  async signUp(req, res) {
    /**
     * Extract user data from request body
     */
    const { name, email, password } = req.body;

    /**
     * Validate user data
     */
    if (!req.body.name) {
      return res.status(201).json({ "error": "Missing name" });
    }
    if (!req.body.email) {
      return res.status(201).json({ "error": "Missing email" });
    }
    if (!req.body.password) {
      return res.status(201).json({ "error": "Missing password" });
    }

    try {
      /**
       * Check if user already exists
       */
      const user = await userModel.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ "error": "User already exist!" });
      } else {
        /**
         * Create a new user
         */
        const newUser = await userModel.create(req.body);
        const response = { id: newUser._id, name: newUser.name, email: newUser.email, user: newUser };
        return res.status(201).json(response);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Handle user login
   * 
   * @async
   * @param {Express.Request} req - The incoming request
   * @param {Express.Response} res - The outgoing response
   */
  async login(req, res) {
    /**
     * Extract authorization data from request headers
     */
    // const auth = req.headers.authorization;
    // const authVal = auth.split(' ')[1];
    // const [email, password] = Buffer.from(authVal, 'base64').toString().split(':');
    const {email, password} = req.body;

    /**
     * Hash the password
     */
    const hp = sha1(password);

    /**
     * Find the user by email
     */
    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res.status(401).json({ error: "You are not a registered user!" });
    }

    if (user.password !== hp) {
      return res.status(401).json({ error: "Wrong password" });
    }

    /**
     * Generate a token and store it in Redis
     */
    const token = v4();
    const authTokenKey = `auth_${token}`;
    await redisClient.set(authTokenKey, user._id.toString(), 60 * 60 * 24);

    return res.status(200).json({ "token": token });
  }

  /**
   * Handle user logout
   * 
   * @async
   * @param {Express.Request} req - The incoming request
   * @param {Express.Response} res - The outgoing response
   */
  async logout(req, res) {
    /**
     * Extract the token from the request headers
     */
    const token = req.header('X-Token');

    if (!token) {
      return res.status(401).json({ error: "Unautorized" });
    }

    /**
     * Remove the token from Redis
     */
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    const user = await userModel.findById(userId);
    console.log(user);

    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    } else {
      await redisClient.del(key);
      res.status(204).send();
    }
  }

  /**
   * Handle password update
   * 
   * @async
   * @param {Express.Request} req - The incoming request
   * @param {Express.Response} res - The outgoing response
   */
  async updatePassword(req, res) {
    /**
     * Extract the user ID and new password from the request
     */
    const id = req.body.id;
    const newPass = sha1(req.body.newPassword);

    /**
     * Update the user's password
     */
    const response = await userModel.findByIdAndUpdate(id, { password: newPass }, { new: true });

    if (!response) {
      return res.status(210).json({ msg: "error", response });
    }
    return res.status(210).json({ msg: "Success", response });
  }

  async loggedIn(req, res, next){
    /**
     * Extract the token from the request headers
     */
    const token = req.header('X-Token');

    if (!token) {
      return res.status(401).json({ error: "Unautorized" });
    }

    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if(!userId){
      return res.status(401).json({ error: "Unauthorized"});
    }
    console.log(userId);
    const user = await userModel.findById(userId.toString());
    // console.log(user);
    if(!user){
      return res.status(401).json({ error: "You are not autorized" });
    }
    req.user = user;
    next();
  }
}

/**
 * Create a new instance of the AuthController class
 */
const authController = new AuthController();

/**
 * Export
 */
export default authController;