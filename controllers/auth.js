const { generateHash } = require("../util/common");

const getLoginPage = (req, res, next) => {
  if (res.locals.isAuthenticated) res.redirect("/");
  else {
    res.render("auth/login", {
      docTitle: "Login",
      myActivePath: "/login",
    });
  }
};

const postLogin = (req, res, next) => {
  // if already authenticated, redirect to home
  if (res.locals.isAuthenticated) {
    res.redirect("/");
    return;
  }

  // naive logic #1
  // const checkCredentials =
  //   req.body.email === "sanjarcode@gmail.com" &&
  //   req.body.password === "password1$"; // assume this is the result of some authentication
  // // const isLoggedIn = false; // uncomment to mock a failed login

  // res.locals.Authenticated = isAuthenticated;

  // if (isAuthenticated) {
  //   res.setHeader("Set-Cookie", "loggedIn=true; x=2; HttpOnly");
  //   res.redirect("/");
  // } else res.redirect("/", 401);

  // slightly better logic
  const email = req.body.email;
  const password = req.body.password;

  const areCredentialsValid =
    email === "sanjarcode@gmail.com" && password === "password1$"; // assume this is the result of some authentication
  // const isLoggedIn = false; // uncomment to mock a failed login
  res.locals.Authenticated = areCredentialsValid;

  if (areCredentialsValid) {
    const authCookieSomeTerm = generateHash(email, password);
    console.log({ authCookieSomeTerm });
    res.setHeader("Set-Cookie", [
      `email=${email}; HttpOnly`,
      `password=${password}; HttpOnly`,
      `authCookieSomeTerm=${authCookieSomeTerm}; HttpOnly`,
    ]);
    res.redirect("/");
  } else res.redirect("/", 401);
};

const getLogout = (req, res, next) => {
  // simplesssst
  // res.setHeader("Set-Cookie", "loggedIn=false; HttpOnly");

  // a little better
  res.setHeader("Set-Cookie", [
    `email=; HttpOnly`,
    `password=; HttpOnly`,
    `authCookieSomeTerm=; HttpOnly`,
  ]);
  res.redirect("/");
};

module.exports = { getLoginPage, postLogin, getLogout };
