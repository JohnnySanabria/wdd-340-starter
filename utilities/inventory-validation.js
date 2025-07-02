const utilities = require(".");
const {
  body,
  validationResult,
} = require("express-validator");
const validate = {};
/* ********************************
 *  Inventory Data Validation Rules
 * ******************************* */
validate.inventoryRules = () => {
  return [
    // classification_id is required and must be a number
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage("Please select a classification."),

    // inv_make is required and must be a string
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a make."),

    // inv_model is required and must be a string
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a model."),

    // inv_year is required and must be a number
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .isLength({ min: 4, max: 4 })
      .withMessage(
        "Please provide a valid year (4 digits)."
      ),

    // inv_description is required and must be a string
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 10 })
      .withMessage("Please provide a description."),

    // inv_color is required and must be a string
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a color."),

    // inv_image is required and must be a valid URL
    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a valid image URL."),

    // inv_thumbnail is required and must be a valid URL
    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a valid thumbnail URL."),

    // inv_price is required and must be a number
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric({ no_symbols: true })
      .withMessage("Please provide a price."),
  ];
};
/* ********************************
 *  Validate inventory data
 * ******************************* */
validate.checkInvData = async (req, res, next) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  let cleaned_inv_image = inv_image.replace(/&#x2F;/g, "/");

  let cleaned_inv_thumbnail = inv_thumbnail.replace(
    /&#x2F;/g,
    "/"
  );

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classificationOptions =
      await utilities.buildClassificationOptions();
    return res.render("inventory/add-vehicle", {
      title: "Add Vehicle",
      nav,
      classificationOptions,
      errors: errors,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image: cleaned_inv_image,
      inv_thumbnail: cleaned_inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
  next();
};

/* ********************************
 *  Classification Validation Rules
 * ******************************* */
validate.classificationRules = () => {
  return [
    // classification_name is required and must be a string
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a classification name."),
  ];
};
/* ********************************
 *  Validate classification data
 * ******************************* */
validate.checkClassificationData = async (
  req,
  res,
  next
) => {
  const errors = validationResult(req);
  let nav = await utilities.getNav();
  const addClassification =
    await utilities.buildAddClassification();
  if (!errors.isEmpty()) {
    return res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      addClassification,
      errors,
    });
  }
  next();
};

/* ********************************
 *  Validate update inventory data
 * ******************************* */
validate.checkUpdateInvData = async (req, res, next) => {
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  let cleaned_inv_image = inv_image.replace(/&#x2F;/g, "/");

  let cleaned_inv_thumbnail = inv_thumbnail.replace(
    /&#x2F;/g,
    "/"
  );

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    const classificationOptions =
      await utilities.buildClassificationOptions();
    let name = `${inv_year} ${inv_make} ${inv_model}`;
    return res.render("inventory/edit-vehicle", {
      title: "Edit Vehicle - " + name,
      nav,
      classificationOptions,
      errors: errors,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image: cleaned_inv_image,
      inv_thumbnail: cleaned_inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
  next();
};

module.exports = validate;
