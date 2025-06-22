const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();

  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(
          vehicle.inv_price
        ) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid =
      '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the details view HTML
 * ************************************ */
Util.buildInventoryDetails = async function (data) {
  return `<div class="details">
    <div class="details-image">
      <img src="${data.inv_image}" alt="Image of ${
    data.inv_make
  } ${data.inv_model} on CSE Motors" />
    </div>
    <div class="details-info">
    <h2>${data.inv_year} ${data.inv_make} ${
    data.inv_model
  } details</h2>
      <p><strong>Price:</strong> $${new Intl.NumberFormat(
        "en-US"
      ).format(data.inv_price)}</p>
      <p><strong>Color:</strong> ${data.inv_color}</p>
      <p><strong>Mileage:</strong> ${new Intl.NumberFormat(
        "en-US"
      ).format(data.inv_miles)} miles</p>
      <p><strong>Description:</strong> ${
        data.inv_description
      }</p>
    </div>`;
};

Util.buildInventoryManagement = async function (data) {
  return `
  <p><a href="../../inv/add-classification" class="button">Add New Classification</a></p>
  <p><a href="../../inv/add-vehicle" class="button">Add New Vehicle</a></p>
  `;
};

Util.buildAddClassification = async function () {
  return `
  <form action="/inv/add-classification" method="post">
    <input type="text" id="classification_name" name="classification_name" placeholder="Classification name" required>
    <button type="submit">Add Classification</button>
  </form>`;
};

Util.buildClassificationOptions = async function () {
  return await invModel
    .getClassifications()
    .then((data) => {
      return data.rows
        .map(
          (row) =>
            `<option value="${row.classification_id}">${row.classification_name}</option>`
        )
        .join("");
    });
};

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

module.exports = Util;
