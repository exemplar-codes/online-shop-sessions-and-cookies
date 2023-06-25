const authRouter = require("express").Router();

authRouter.get("/login", (req, res, next) => {
  res.render("auth/login", {
    docTitle: "Login",
    myActivePath: "/login",
  });
});

authRouter.post("/login", (req, res, next) => {
  res.redirect("/");
});

authRouter.get("/logout", (req, res, next) => {
  //   res.send("Log out");
  res.redirect("/");
});

module.exports = authRouter;
