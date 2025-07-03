const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accValidate = require("../utilities/account-validation");
const accountController = require("../controllers/accountController");

router.get(
  "/",
  utilities.checkLogin,
  accountController.buildManagement
);
router.get("/login", accountController.buildLogin);
// Process the login attempt
router.post(
  "/login",
  accValidate.loginRules(),
  accValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);
router.get("/logout", utilities.checkLogin, accountController.accountLogout);
router.get("/register", accountController.buildRegister);
router.post(
  "/register",
  accValidate.registationRules(),
  accValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

module.exports = router;
