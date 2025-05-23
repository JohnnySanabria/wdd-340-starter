const errorController = {};
errorController.buildError = async function (
  req,
  res,
  next
) {
  const err = new Error(
    "An error occurred while processing your request."
  );
  err.status = 500;
  next(err);
};

module.exports = errorController;
