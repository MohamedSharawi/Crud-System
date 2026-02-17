// ====== Elements ======
var nameInput = document.getElementById("productName");
var priceInput = document.getElementById("productPrice");
var typeInput = document.getElementById("productType");
var descriptionInput = document.getElementById("productDescription");
var imageInput = document.getElementById("productImage");
var addBtn = document.getElementById("addBtn");
var updateBtn = document.getElementById("updateBtn");
var searchInput = document.getElementById("searchInput");
var tableBody = document.getElementById("tableBody");

var nameValid = document.getElementById("nameValid");
var priceValid = document.getElementById("priceValid");
var typeValid = document.getElementById("typeValid");
var descriptionValid = document.getElementById("descriptionValid");

// ====== State ======
var productList = [];
var currentIndex = null;

// ====== Init (load from localStorage) ======
if (localStorage.getItem("products") != null) {
  try {
    productList = JSON.parse(localStorage.getItem("products")) || [];
  } catch {
    productList = [];
  }
  display();
}

// ====== Helpers ======
function persist() {
  localStorage.setItem("products", JSON.stringify(productList));
}

function clearForm() {
  nameInput.value = "";
  priceInput.value = "";
  typeInput.value = "";
  descriptionInput.value = "";
  imageInput.value = "";
}

function resetValidation() {
  // Remove validation classes
  nameInput.classList.remove("is-valid", "is-invalid");
  priceInput.classList.remove("is-valid", "is-invalid");
  typeInput.classList.remove("is-valid", "is-invalid");
  descriptionInput.classList.remove("is-valid", "is-invalid");

  // Hide alerts
  nameValid.classList.add("d-none");
  priceValid.classList.add("d-none");
  typeValid.classList.add("d-none");
  descriptionValid.classList.add("d-none");
}

// Optional: convert image file to Object URL (lightweight)
// ObjectURL 
function fileToObjectURL(file) {
  return URL.createObjectURL(file);
}

// ====== Validations ======
// Name: Capital 
function nameValidation() {
  var regex = /^[A-Z][a-zA-Z]{2,7}$/;
  var text = nameInput.value.trim();

  if (text === "") {
    nameValid.classList.add("d-none");
    nameInput.classList.remove("is-valid", "is-invalid");
    return false;
  }
  if (regex.test(text)) {
    nameValid.classList.add("d-none");
    nameInput.classList.add("is-valid");
    nameInput.classList.remove("is-invalid");
    return true;
  } else {
    nameValid.classList.remove("d-none");
    nameInput.classList.add("is-invalid");
    nameInput.classList.remove("is-valid");
    return false;
  }
}

// Price: 
function priceValidation() {
  var regex = /^(1000|[1-9]\d{3}|1\d{4}|20000)$/;
  var text = priceInput.value.trim();

  if (text === "") {
    priceValid.classList.add("d-none");
    priceInput.classList.remove("is-valid", "is-invalid");
    return false;
  }
  if (regex.test(text)) {
    priceValid.classList.add("d-none");
    priceInput.classList.add("is-valid");
    priceInput.classList.remove("is-invalid");
    return true;
  } else {
    priceValid.classList.remove("d-none");
    priceInput.classList.add("is-invalid");
    priceInput.classList.remove("is-valid");
    return false;
  }
}

// Type: 
function typeValidation() {
  var regex = /^(mobile|screen|tablet|watch)$/i;
  var text = typeInput.value.trim();

  if (text === "") {
    typeValid.classList.add("d-none");
    typeInput.classList.remove("is-valid", "is-invalid");
    return false;
  }
  if (regex.test(text)) {
    typeValid.classList.add("d-none");
    typeInput.classList.add("is-valid");
    typeInput.classList.remove("is-invalid");
    return true;
  } else {
    typeValid.classList.remove("d-none");
    typeInput.classList.add("is-invalid");
    typeInput.classList.remove("is-valid");
    return false;
  }
}

// Description: 
function descriptionValidation() {
  var regex = /^.{1,500}$/s; 
  var text = descriptionInput.value;

  if (text.trim() === "") {
    descriptionValid.classList.add("d-none");
    descriptionInput.classList.remove("is-valid", "is-invalid");
    return false;
  }
  if (regex.test(text)) {
    descriptionValid.classList.add("d-none");
    descriptionInput.classList.add("is-valid");
    descriptionInput.classList.remove("is-invalid");
    return true;
  } else {
    descriptionValid.classList.remove("d-none");
    descriptionInput.classList.add("is-invalid");
    descriptionInput.classList.remove("is-valid");
    return false;
  }
}

// ====== CRUD ======
function addProduct() {
  // Validate all fields first
  var ok =
    nameValidation() &&
    priceValidation() &&
    typeValidation() &&
    descriptionValidation();

  if (!ok || typeInput.value.trim() === "") {
    Swal.fire({
      icon: "warning",
      title: "Missing or Invalid Data",
      text: "Please make sure all fields are filled correctly!",
    });
    return;
  }

  var product = {
    name: nameInput.value.trim(),
    price: priceInput.value.trim(),
    type: typeInput.value.trim(),
    description: descriptionInput.value.trim(),
    image:
      imageInput.files && imageInput.files[0]
        ? fileToObjectURL(imageInput.files[0])
        : "",
  };

  productList.push(product);
  persist();
  display();
  clearForm();
  resetValidation();


  Swal.fire({
    icon: "success",
    title: "Added!",
    text: "Product has been added successfully.",
    timer: 1200,
    showConfirmButton: false,
  });
}

function display(list = productList) {
  var items = "";
  for (var i = 0; i < list.length; i++) {
    var p = list[i];
    items += `
      <tr>
        <td>${i + 1}</td>
        <td>${escapeHTML(p.name)}</td>
        <td>${escapeHTML(p.price)} $</td>
        <td>${escapeHTML(p.type)}</td>
        <td>${escapeHTML(p.description)}</td>
        <td>${
          p.image
            ? `<img src="${p.image}" alt="ProductImg.." class="product-img">`
            : "-"
        }</td>
        <td>
          <button class="btn btn-warning text-capitalize mx-2 px-3" onclick="editProduct(${i})">
            <i class="fa-regular fa-pen-to-square"></i>
          </button>
          <button class="btn btn-danger text-capitalize px-3 fw-semibold" onclick="deleteProduct(${i})">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </td>
      </tr>`;
  }
  tableBody.innerHTML = items;
}


function escapeHTML(str) {
  if (typeof str !== "string") return str;
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function deleteProduct(index) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      productList.splice(index, 1);
      persist();
      display();
      Swal.fire("Deleted!", "Your product has been deleted.", "success");
    }
  });
}

function editProduct(i) {
  currentIndex = i;
  var p = productList[currentIndex];

  nameInput.value = p.name;
  priceInput.value = p.price;
  typeInput.value = p.type;
  descriptionInput.value = p.description;

  // Reset validation state when entering edit mode
  resetValidation();

  updateBtn.classList.remove("d-none");
  addBtn.classList.add("d-none");
}

function updateProduct() {
  // Validate first
  var ok =
    nameValidation() &&
    priceValidation() &&
    typeValidation() &&
    descriptionValidation();

  if (!ok) {
    Swal.fire({
      icon: "warning",
      title: "Oops...",
      text: "Please fill in all required fields correctly!",
    });
    return;
  }

  Swal.fire({
    title: "Update Product?",
    text: "Do you want to save changes to this product?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, update it!",
  }).then((result) => {
    if (result.isConfirmed) {
      productList[currentIndex].name = nameInput.value.trim();
      productList[currentIndex].price = priceInput.value.trim();
      productList[currentIndex].type = typeInput.value.trim();
      productList[currentIndex].description = descriptionInput.value.trim();

      if (imageInput.files && imageInput.files.length > 0) {
        productList[currentIndex].image = fileToObjectURL(imageInput.files[0]);
      }

      persist();
      display();
      clearForm();
      resetValidation();
      updateBtn.classList.add("d-none");
      addBtn.classList.remove("d-none");

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Your product has been updated.",
        timer: 1200,
        showConfirmButton: false,
      });
    }
  });
}

// ====== Search ======
function searchProduct() {
  var term = (searchInput.value || "").toLowerCase();
  if (!term) {
    display(); // original list
    return;
  }

  // Filter without mutating the original array
  var filtered = productList.filter(function (p) {
    return (
      (p.name && p.name.toLowerCase().includes(term)) ||
      (p.price && p.price.toString().toLowerCase().includes(term)) ||
      (p.type && p.type.toLowerCase().includes(term)) ||
      (p.description && p.description.toLowerCase().includes(term))
    );
  });

  // Show filtered list
  var items = "";
  for (var i = 0; i < filtered.length; i++) {
    var p = filtered[i];
    items += `
      <tr>
        <td>${i + 1}</td>
        <td>${escapeHTML(p.name)}</td>
        <td>${escapeHTML(p.price)} $</td>
        <td>${escapeHTML(p.type)}</td>
        <td>${escapeHTML(p.description)}</td>
        <td>${
          p.image
            ? `<img src="${p.image}" alt="ProductImg.." class="product-img">`
            : "-"
        }</td>
        <td>
          <button class="btn btn-secondary mx-2 px-3" disabled title="Edit disabled while filtering">
            <i class="fa-regular fa-pen-to-square"></i>
          </button>
          <button class="btn btn-secondary px-3 fw-semibold" disabled title="Delete disabled while filtering">
            <i class="fa-regular fa-trash-can"></i>
          </button>
        </td>
      </tr>`;
  }
  tableBody.innerHTML = items;
}