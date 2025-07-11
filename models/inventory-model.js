const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/* ***************************
 *  Get classifications for nav
 * ************************** */
async function getClassificationsForNav() {
  return await pool.query(
    `SELECT c.classification_id, c.classification_name, c.classification_approved, c.account_id, c.classification_approval_date, COUNT(i.inv_id) AS inventory_count
      FROM public.classification c
      JOIN public.inventory i
        ON i.classification_id = c.classification_id
      WHERE c.classification_approved = true AND i.inv_approved = true
      GROUP BY c.classification_id
      HAVING COUNT(i.inv_id) > 1
      ORDER BY c.classification_id;`
  );
}
/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(
  classification_id
) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
}

/* ***************************
 *  Get approved inventory items and classification_name by classification_id
 * ************************** */
async function getApprovedInventoryByClassificationId(
  classification_id
) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1 AND i.inv_approved = true`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationsbyid error " + error);
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByInventoryId(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
        WHERE i.inv_id = $1`,
      [inv_id]
    );

    return data.rows;
  } catch (error) {
    console.error(
      "getInventoryByInventoryId error " + error
    );
  }
}

/* *****************************
 *   Add new classification
 * *************************** */
async function addClassification(classification_name) {
  try {
    const sql =
      "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    return error.message;
  }
}

/* *****************************
 *   Add new vehicle to inventory
 * *************************** */
async function addVehicle(
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
) {
  if (typeof inv_image === "string") {
    inv_image = inv_image.replace(/&#x2F;/g, "/");
  }
  if (typeof inv_thumbnail === "string") {
    inv_thumbnail = inv_thumbnail.replace(/&#x2F;/g, "/");
  }

  try {
    const sql = `INSERT INTO inventory (   
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
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
    return await pool.query(sql, [
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
    ]);
  } catch (error) {
    console.log("addVehicle error " + error);
    return error.message;
  }
}

/* *****************************
 *   Update vehicle to inventory
 * *************************** */
async function updateVehicle(
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
) {
  if (typeof inv_image === "string") {
    inv_image = inv_image.replace(/&#x2F;/g, "/");
  }
  if (typeof inv_thumbnail === "string") {
    inv_thumbnail = inv_thumbnail.replace(/&#x2F;/g, "/");
  }

  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *";
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id,
    ]);
    return data.rows[0];
  } catch (error) {
    console.log("updateVehicle error " + error);
    return error.message;
  }
}

/* *****************************
 *   Delete vehicle from inventory
 * *************************** */
async function deleteVehicle(inv_id) {
  try {
    const sql =
      "DELETE FROM public.inventory WHERE inv_id = $1";
    const data = await pool.query(sql, [inv_id]);
    return data;
  } catch (error) {
    console.log("deleteVehicle error " + error);
    return error.message;
  }
}

async function getUnapprovedClassifications() {
  try {
    const sql = `SELECT * FROM public.classification WHERE classification_approved = false`;
    return await pool.query(sql);
  } catch (error) {
    console.error(
      "getUnapprovedClassifications error " + error
    );
  }
}

async function getUnapprovedInventory() {
  try {
    const sql = `SELECT * FROM public.inventory WHERE inv_approved = false`;
    return await pool.query(sql);
  } catch (error) {
    console.error("getUnapprovedInventory error " + error);
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryByInventoryId,
  addVehicle,
  addClassification,
  updateVehicle,
  deleteVehicle,
  getClassificationsForNav,
  getApprovedInventoryByClassificationId,
  getUnapprovedClassifications,
  getUnapprovedInventory,
};
