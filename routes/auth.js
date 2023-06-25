const authController = require("../controllers/auth");

const authRouter = require("express").Router();

authRouter.get("/login", authController.getLoginPage);

authRouter.post("/login", authController.postLogin);

authRouter.get("/logout", authController.getLogout);

module.exports = authRouter;
