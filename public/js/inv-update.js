const form = document.querySelector("#editVehicleForm");
form.addEventListener("change", function () {
  const updateBtn = document.querySelector("button");
  updateBtn.removeAttribute("disabled");
});

const select = document.getElementById("classification_id");

const classificationIdValue = document.getElementById(
  "classification_id_hidden"
).value;

document.addEventListener("DOMContentLoaded", () => {
  if (classificationIdValue) {
    select.value = classificationIdValue;
  } else {
    const storedClassificationId = localStorage.getItem(
      "classification_id"
    );
    if (storedClassificationId) {
      select.value = storedClassificationId;
    }
  }
});

select.addEventListener("change", () => {
  localStorage.setItem("classification_id", select.value);
});
