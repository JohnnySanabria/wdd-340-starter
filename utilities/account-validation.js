const utilities = require(".");
const accountModel = require("../models/account-model");
const {
  body,
  validationResult,
} = require("express-validator");
const validate = {};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists =
          await accountModel.checkExistingEmail(
            account_email
          );
        if (emailExists) {
          throw new Error(
            "Email exists. Please log in or use different email"
          );
        }
      }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const {
    account_firstname,
    account_lastname,
    account_email,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    // valid email is required
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),

    // password is required
    body("account_password")
      .trim()
      .notEmpty()
      .withMessage("Invalid password."),
  ];
};

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Update Data Validation Rules
 * ********************************* */
validate.updateRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    // valid email is required
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),
  ];
};

/* ******************************
 * Check data and return errors or continue to update
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const {
    account_firstname,
    account_lastname,
    account_email,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/update", {
      errors,
      title: "Update Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account_id: req.body.account_id,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Update Password Validation Rules
 * ********************************* */
validate.updatePasswordRules = () => {
  return [
    // password is required and must be strong password
    body("new_account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
    body("new_account_password_confirm")
      .trim()
      .notEmpty()
      .custom((value, { req }) => {
        if (value !== req.body.new_account_password) {
          throw new Error("Passwords do not match.");
        }
        return true;
      })
      .withMessage("Passwords do not match."),
  ];
};

/* ******************************
 * Check data and return errors or continue to update password
 * ***************************** */
validate.checkUpdatePasswordData = async (
  req,
  res,
  next
) => {
  const {
    new_account_password,
    new_account_password_confirm,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let account_data = await accountModel.getAccountById(
      req.body.account_id
    );
    res.render("account/update", {
      errors,
      title: "Update Account",
      nav,
      account_firstname: account_data.account_firstname,
      account_lastname: account_data.account_lastname,
      account_email: account_data.account_email,
      account_id: req.body.account_id,
    });
    return;
  }
  next();
};

module.exports = validate;
