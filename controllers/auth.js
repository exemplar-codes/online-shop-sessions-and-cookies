const getLoginPage = (req, res, next) => {
  res.render("auth/login", {
    docTitle: "Login",
    myActivePath: "/login",
  });
};

const postLogin = (req, res, next) => {
  res.redirect("/");
};

const getLogout = (req, res, next) => {
  res.redirect("/");
};

module.exports = { getLoginPage, postLogin, getLogout };
