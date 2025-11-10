import swaggerUi from "swagger-ui-express";
import authRouter from "./modules/auth/authRouter.js";
import usersRouter from "./modules/user/usersRouter.js";
import authController from "./modules/auth/authController.js";
import walletRoutes from "./modules/wallet/wallet.routes.js";

/**
 * Bootstrap function to configure Express app routes
 * 
 * @param {Express.Application} app - The Express app instance
 */
const bootstrap = (app) => {
  /**
   * Configure API routes
   */
  app.use('/api/auth', authRouter);
  app.use('/api/wallet', walletRoutes);
  app.use('/api/users', [authController.loggedIn], usersRouter);

  // console.log(swagger);
  // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc, {explorer: true})); // manual swagger
  // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swagger, {explorer: true})); //autogen

  /**
   * Catch-all route for handling unknown requests
   */
  app.all('*', (req, res, next) => {
    return res.status(404).json({ error: "No route found"});
  });
};

/**
 * Export the bootstrap function
 */
export default bootstrap;