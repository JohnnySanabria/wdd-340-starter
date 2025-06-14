const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (
  req,
  res,
  next
) {
  const classification_id = req.params.classificationId;
  const data =
    await invModel.getInventoryByClassificationId(
      classification_id
    );
  const grid = await utilities.buildClassificationGrid(
    data
  );
  let nav = await utilities.getNav();
  const className = data[0]?.classification_name ?? "Toy";
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  });
};

/* ***************************
 *  Build inventory by vehicle view
 * ************************** */
invCont.buildByInventoryId = async function (
  req,
  res,
  next
) {
  const inv_id = req.params.vehicleId;
  const data = await invModel.getInventoryByInventoryId(
    inv_id
  );
  const details = await utilities.buildInventoryDetails(
    data[0]
  );
  let nav = await utilities.getNav();

  const className = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`;
  res.render("./inventory/details", {
    title: className,
    nav,
    details,
    errors: null,
  });
};

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildInventoryManagement = async function (
  req,
  res,
  next
) {
  const management =
    await utilities.buildInventoryManagement();

  let nav = await utilities.getNav();

  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    management,
    errors: null,
  });
};

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (
  req,
  res,
  next
) {
  const addClassification =
    await utilities.buildAddClassification();

  let nav = await utilities.getNav();

  res.render("./inventory/add-classification", {
    title: "Add Classification",
    nav,
    addClassification,
    errors: null,
  });
};

/* ***************************
 *  Build add vehicle view
 * ************************** */
invCont.buildAddVehicle = async function (req, res, next) {
  const classificationOptions =
    await utilities.buildClassificationOptions();

  let nav = await utilities.getNav();

  res.render("./inventory/add-vehicle", {
    title: "Add Vehicle",
    nav,
    classificationOptions,
    errors: null,
  });
};

// /* ***************************
//  *  Add Classification
//  *************************** */
invCont.addClassification = async function (
  req,
  res,
  next
) {
  const { classification_name } = req.body;
  const result = await invModel.addClassification(
    classification_name
  );
  const nav = await utilities.getNav();
  const addClassification =
    await utilities.buildAddClassification();
  const management =
    await utilities.buildInventoryManagement();
  if (result) {
    req.flash(
      "notice",
      `Classification ${classification_name} was successfully added.`
    );
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
      management,
      errors: null,
    });
  } else {
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      addClassification,
      errors: result.errors,
    });
  }
};

// /* ***************************
//  *  Add Vehicle
//  *************************** */
invCont.addVehicle = async function (req, res, next) {
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
  const result = await invModel.addVehicle(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  const nav = await utilities.getNav();
  const classificationOptions =
    await utilities.buildClassificationOptions();

  const management =
    await utilities.buildInventoryManagement();
  if (result) {
    req.flash("notice", `Vehicle was successfully added.`);
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
      management,
      errors: null,
    });
  } else {
    req.flash(
      "notice",
      "Sorry, there was an error adding the vehicle."
    );
    res.render("./inventory/add-vehicle", {
      title: "Add Vehicle",
      nav,
      classificationOptions,
      errors: result.errors,
    });
  }
};

module.exports = invCont;
