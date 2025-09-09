/**
 * Import required modules
 */
import sha1 from "sha1"; // SHA-1 hashing library for password encryption
import userModel from "./user.model.js"; // User model for database interactions

/**
 * Define a class to manage user-related operations
 */
class UsersController {
  /**
   * Add a new user to the database
   * 
   * @async
   * @param {Express.Request} req - The incoming request
   * @param {Express.Response} res - The outgoing response
   */
  async addUser(req, res) {
    // Validate user data
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
      // Check if user already exists
      const user = await userModel.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ "error": "User already exist!" });
      } else {
        // Create a new user
        const newUser = await userModel.create(req.body);
        const response = { user: newUser };
        return res.status(201).json(response);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  /**
   * Retrieve all users from the database
   * 
   * @async
   * @param {Express.Request} req - The incoming request
   * @param {Express.Response} res - The outgoing response
   */
  async getAllUsers(req, res) {
    const users = await userModel.find();
    const response = { message: "Success", users: users };
    res.status(201).json(response);
  }

  /**
   * Update a user's data in the database
   * 
   * @async
   * @param {Express.Request} req - The incoming request
   * @param {Express.Response} res - The outgoing response
   */
  async updateUser(req, res) {
    let { id } = req.params;
    const updatedUser = await userModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "Can not update user" });
    }
    return res.status(201).json({ updatedUser });
  }

  /**
   * Retrieve a user by a specific key
   * 
   * @async
   * @param {Express.Request} req - The incoming request
   * @param {Express.Response} res - The outgoing response
   */
  async getUserBy(req, res) {
    const key = req.params;
    console.log(key);
    const user = await userModel.findOne({ key });
    if (!user) {
      return res.status(404).json({ result: "No user found!" });
    }
    return res.status(200).json({ result: "success", user });
  }

  /**
   * Delete a user from the database
   * 
   * @async
   * @param {Express.Request} req - The incoming request
   * @param {Express.Response} res - The outgoing response
   */
  async deleteUser(req, res) {
    const { id } = req.params;
    const deletedUser = await userModel.findByIdAndDelete(id, { new: true });
    if (!deletedUser) {
      return res.status(404).json({ error: "No User found", deletedUser });
    }
    res.status(201).json({ ...deletedUser });
  }

  /**
   * Delete all users from the database
   * 
   * @async
   * @param {Express.Request} req - The incoming request
   * @param {Express.Response} res - The outgoing response
   */
  async deleteAll(req, res) {
    let result = await userModel.deleteMany();
    if (result) {
      return res.status(200).json({ "status": "Delete all users successful", result });
    }
    return res.status(201).json({ "status": "Delete all users not successful" });
  }
}

/**
 * Create a new instance of the UsersController class
 */
const usersController = new UsersController();

/**
 * Export the UsersController instance
 */
export default usersController;