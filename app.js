let vehicles = JSON.parse(localStorage.getItem("mmAutoLinkVehicles")) || [];
let currentType = "purchase";

document.addEventListener("DOMContentLoaded", () => {
  updateDashboard();
  renderVehicles();

  document
    .getElementById("vehicleForm")
    .addEventListener("submit", saveVehicle);

  document
    .getElementById("searchBox")
    .addEventListener("input", renderVehicles);
});

function showForm(type) {
  currentType = type;

  document.getElementById("formSection").classList.remove("hidden");

  document.getElementById("formTitle").textContent =
    type === "purchase" ? "Add Purchase" : "Add Sale";

  document.getElementById("vehicleForm").reset();

  window.scrollTo({
    top: document.getElementById("formSection").offsetTop,
    behavior: "smooth"
  });
}

function closeForm() {
  document.getElementById("formSection").classList.add("hidden");
}

function saveVehicle(event) {
  event.preventDefault();

  const vehicle = {
    id: Date.now(),

    type: currentType,

    vehicleNumber:
      document.getElementById("vehicleNumber").value.trim().toUpperCase(),

    model:
      document.getElementById("vehicleModel").value.trim(),

    year:
      document.getElementById("vehicleYear").value,

    owner:
      document.getElementById("ownerName").value.trim(),

    phone:
      document.getElementById("phoneNumber").value.trim(),

    price:
      Number(document.getElementById("vehiclePrice").value) || 0,

    rcStatus:
      document.getElementById("rcStatus").value,

    notes:
      document.getElementById("notes").value.trim(),

    date:
      new Date().toISOString()
  };

  vehicles.push(vehicle);

  localStorage.setItem(
    "mmAutoLinkVehicles",
    JSON.stringify(vehicles)
  );

  updateDashboard();
  renderVehicles();
  closeForm();

  alert(
    currentType === "purchase"
      ? "Purchase saved successfully!"
      : "Sale saved successfully!"
  );
}

function updateDashboard() {
  const totalVehicles = vehicles.length;

  const purchases = vehicles.filter(
    vehicle => vehicle.type === "purchase"
  );

  const sales = vehicles.filter(
    vehicle => vehicle.type === "sale"
  );

  const purchaseTotal = purchases.reduce(
    (sum, vehicle) => sum + vehicle.price,
    0
  );

  const saleTotal = sales.reduce(
    (sum, vehicle) => sum + vehicle.price,
    0
  );

  const profit = saleTotal - purchaseTotal;

  document.getElementById("totalVehicles").textContent =
    totalVehicles;

  document.getElementById("totalPurchases").textContent =
    formatMoney(purchaseTotal);

  document.getElementById("totalSales").textContent =
    formatMoney(saleTotal);

  document.getElementById("totalProfit").textContent =
    formatMoney(profit);
}

function renderVehicles() {
  const list = document.getElementById("vehicleList");
  const search = document
    .getElementById("searchBox")
    .value
    .toLowerCase()
    .trim();

  const filtered = vehicles.filter(vehicle =>
    vehicle.vehicleNumber.toLowerCase().includes(search) ||
    vehicle.model.toLowerCase().includes(search) ||
    vehicle.phone.toLowerCase().includes(search)
  );

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="empty">
        No vehicles found.
      </div>
    `;
    return;
  }

  list.innerHTML = filtered
    .slice()
    .reverse()
    .map(vehicle => `
      <div class="vehicle-card">

        <div class="vehicle-top">
          <div>
            <h3>${escapeHTML(vehicle.model)}</h3>
            <strong>${escapeHTML(vehicle.vehicleNumber)}</strong>
          </div>

          <span class="badge ${vehicle.type}">
            ${vehicle.type === "purchase" ? "PURCHASE" : "SALE"}
          </span>
        </div>

        <div class="vehicle-details">

          <p>
            <b>Year:</b>
            ${escapeHTML(vehicle.year || "-")}
          </p>

          <p>
            <b>Owner:</b>
            ${escapeHTML(vehicle.owner || "-")}
          </p>

          <p>
            <b>Phone:</b>
            ${escapeHTML(vehicle.phone || "-")}
          </p>

          <p>
            <b>Price:</b>
            ${formatMoney(vehicle.price)}
          </p>

          <p>
            <b>RC:</b>
            ${escapeHTML(vehicle.rcStatus)}
          </p>

        </div>

        ${
          vehicle.notes
            ? `<p class="notes"><b>Notes:</b> ${escapeHTML(vehicle.notes)}</p>`
            : ""
        }

        <button
          class="delete-button"
          onclick="deleteVehicle(${vehicle.id})">
          Delete
        </button>

      </div>
    `)
    .join("");
}

function deleteVehicle(id) {
  const confirmed = confirm(
    "Delete this vehicle record?"
  );

  if (!confirmed) return;

  vehicles = vehicles.filter(
    vehicle => vehicle.id !== id
  );

  localStorage.setItem(
    "mmAutoLinkVehicles",
    JSON.stringify(vehicles)
  );

  updateDashboard();
  renderVehicles();
}

function formatMoney(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(amount);
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}