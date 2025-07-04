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
router.get(
  "/logout",
  utilities.checkLogin,
  accountController.accountLogout
);
router.get("/register", accountController.buildRegister);
router.post(
  "/register",
  accValidate.registationRules(),
  accValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  accountController.buildUpdate
);
router.post(
  "/update",
  accValidate.updateRules(),
  accValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);
router.post(
  "/update/password",
  accValidate.updatePasswordRules(),
  accValidate.checkUpdatePasswordData,
  utilities.handleErrors(
    accountController.updateAccountPassword
  )
);

module.exports = router;
