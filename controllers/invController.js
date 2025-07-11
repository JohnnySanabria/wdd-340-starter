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
    await invModel.getApprovedInventoryByClassificationId(
      classification_id
    );
  const grid = await utilities.buildClassificationGrid(
    data
  );
  let nav = await utilities.getNav();
  let classification = (
    await invModel.getClassifications()
  ).rows.find(
    (item) => item.classification_id === classification_id
  );
  const className =
    data[0]?.classification_name ??
    classification?.classification_name ??
    "";
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
  let nav = await utilities.getNav();

  const classificationOptions =
    await utilities.buildClassificationOptions();

  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    classificationOptions,
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

/* ***************************
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
  const classificationOptions =
    await utilities.buildClassificationOptions();
  if (result) {
    req.flash(
      "notice",
      `Classification ${classification_name} was successfully added.`
    );
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
      classificationOptions,
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

/* ***************************
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
  if (result) {
    req.flash("notice", `Vehicle was successfully added.`);
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
      classificationOptions,
      errors: null,
    });
  } else {
    req.flash(
      "notice",
      "Sorry, there was an error adding the vehicle."
    );
    const classificationOptions =
      await utilities.buildClassificationOptions();
    res.render("./inventory/add-vehicle", {
      title: "Add Vehicle",
      nav,
      classificationOptions,
      errors: result.errors,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(
    req.params.classificationId
  );
  const invData =
    await invModel.getInventoryByClassificationId(
      classification_id
    );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build edit vehicle view
 * ************************** */
invCont.buildEditVehicle = async function (req, res, next) {
  const inv_id = parseInt(req.params.inventoryId);

  let nav = await utilities.getNav();

  let data = await invModel.getInventoryByInventoryId(
    inv_id
  );
  data = data[0];
  let name = `${data.inv_year} ${data.inv_make} ${data.inv_model}`;

  const classificationOptions =
    await utilities.buildClassificationOptions();

  res.render("./inventory/edit-vehicle", {
    title: "Edit Vehicle - " + name,
    nav,
    classificationOptions,
    inv_id: data.inv_id,
    inv_make: data.inv_make,
    inv_model: data.inv_model,
    inv_year: data.inv_year,
    inv_description: data.inv_description,
    inv_image: data.inv_image,
    inv_thumbnail: data.inv_thumbnail,
    inv_price: data.inv_price,
    inv_miles: data.inv_miles,
    inv_color: data.inv_color,
    classification_id: data.classification_id,
    errors: null,
  });
};

/* ***************************
//  *  Edit Vehicle
//  *************************** */
invCont.editVehicle = async function (req, res, next) {
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
  const result = await invModel.updateVehicle(
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
    classification_id
  );

  const nav = await utilities.getNav();
  const classificationOptions =
    await utilities.buildClassificationOptions();

  if (result) {
    req.flash(
      "notice",
      `Vehicle was successfully updated.`
    );
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
      classificationOptions,
      errors: null,
    });
  } else {
    req.flash(
      "notice",
      "Sorry, there was an error adding the vehicle."
    );
    let name = `${inv_year} ${inv_make} ${inv_model}`;

    res.render("./inventory/edit-vehicle", {
      title: "Edit Vehicle - " + name,
      nav,
      classificationOptions,
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
      errors: null,
    });
  }
};

/* ***************************
 *  Build delete vehicle view
 * ************************** */
invCont.buildDeleteVehicle = async function (
  req,
  res,
  next
) {
  const inv_id = parseInt(req.params.inventoryId);

  let nav = await utilities.getNav();

  let data = await invModel.getInventoryByInventoryId(
    inv_id
  );
  data = data[0];
  let name = `${data.inv_year} ${data.inv_make} ${data.inv_model}`;

  res.render("./inventory/delete-vehicle", {
    title: "Delete Vehicle - " + name,
    nav,
    inv_id: data.inv_id,
    inv_make: data.inv_make,
    inv_model: data.inv_model,
    inv_year: data.inv_year,
    inv_price: data.inv_price,
    errors: null,
  });
};

/* ***************************
//  *  Delete Vehicle
//  *************************** */
invCont.deleteVehicle = async function (req, res, next) {
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
  } = req.body;

  const result = await invModel.deleteVehicle(inv_id);
  
  const nav = await utilities.getNav();
  const classificationOptions =
    await utilities.buildClassificationOptions();

  if (result) {
    req.flash(
      "notice",
      `Vehicle was successfully deleted.`
    );
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
      classificationOptions,
      errors: null,
    });
  } else {
    req.flash(
      "notice",
      "Sorry, there was an error deleting the vehicle."
    );
    let name = `${inv_year} ${inv_make} ${inv_model}`;

    res.render("./inventory/delete-vehicle", {
      title: "Delete Vehicle - " + name,
      nav,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
      errors: null,
    });
  }
};

/* ***************************
 *  Build approval list view
 * ************************** */
invCont.buildApprovalList = async function (
  req,
  res,
  next
) {
  const nav = await utilities.getNav();

  const unapprovedClassifications =
    await invModel.getUnapprovedClassifications();
  const unapprovedInventory =
    await invModel.getUnapprovedInventory();

  res.render("./inventory/approval-list", {
    title: "Approval List",
    nav,
    unapprovedClassifications:
      unapprovedClassifications.rows,
    unapprovedInventory: unapprovedInventory.rows,
    errors: null,
  });
};

module.exports = invCont;
