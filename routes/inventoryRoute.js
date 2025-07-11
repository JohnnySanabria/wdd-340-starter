const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const invValidate = require("../utilities/inventory-validation");
const utilities = require("../utilities/index");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  invController.buildByClassificationId
);

router.get(
  "/detail/:vehicleId",
  invController.buildByInventoryId
);

router.get(
  "/",
  utilities.checkEmployeeOrAdmin,
  invController.buildInventoryManagement
);
router.get(
  "/add-classification",
  utilities.checkEmployeeOrAdmin,
  invController.buildAddClassification
);
router.post(
  "/add-classification",
  utilities.checkEmployeeOrAdmin,
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  invController.addClassification
);
router.get(
  "/add-vehicle",
  utilities.checkEmployeeOrAdmin,
  invController.buildAddVehicle
);
router.post(
  "/add-vehicle",
  utilities.checkEmployeeOrAdmin,
  invValidate.inventoryRules(),
  invValidate.checkInvData,
  invController.addVehicle
);
router.get(
  "/getInventory/:classificationId",
  utilities.handleErrors(invController.getInventoryJSON)
);

router.get(
  "/edit/:inventoryId",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildEditVehicle)
);
router.post(
  "/edit/",
  utilities.checkEmployeeOrAdmin,
  invValidate.inventoryRules(),
  invValidate.checkUpdateInvData,
  utilities.handleErrors(invController.editVehicle)
);

router.get(
  "/delete/:inventoryId",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildDeleteVehicle)
);
router.post(
  "/delete/",
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.deleteVehicle)
);
router.get(
  "/approval-list",
  utilities.checkAdmin,
  invController.buildApprovalList
);

module.exports = router;
