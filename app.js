document.addEventListener("DOMContentLoaded", () => {
  const vehicles = [
    // Vehicles will be added here later
  ];

  const totalVehicles = document.getElementById("totalVehicles");
  const totalPurchases = document.getElementById("totalPurchases");
  const totalSales = document.getElementById("totalSales");
  const totalProfit = document.getElementById("totalProfit");

  const purchaseTotal = vehicles.reduce(
    (sum, vehicle) => sum + (vehicle.purchasePrice || 0),
    0
  );

  const saleTotal = vehicles.reduce(
    (sum, vehicle) => sum + (vehicle.salePrice || 0),
    0
  );

  const profit = saleTotal - purchaseTotal;

  totalVehicles.textContent = vehicles.length;
  totalPurchases.textContent = `₹${purchaseTotal.toLocaleString("en-IN")}`;
  totalSales.textContent = `₹${saleTotal.toLocaleString("en-IN")}`;
  totalProfit.textContent = `₹${profit.toLocaleString("en-IN")}`;
});