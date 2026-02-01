const locations = [
  {
    name: "De Bessenhof",
    category: "fruit",
    address: "Bergschenhoek, Zuid-Holland",
    lat: 51.9906,
    lng: 4.512,
    products: ["Aardbeien", "Kersen", "Blauwe bessen"],
  },
  {
    name: "MelkTap Noord",
    category: "dairy",
    address: "Groningen, Groningen",
    lat: 53.2194,
    lng: 6.5665,
    products: ["Verse melk", "Yoghurt"],
  },
  {
    name: "Boerderij De Weide",
    category: "mixed",
    address: "Barneveld, Gelderland",
    lat: 52.1405,
    lng: 5.5846,
    products: ["Eieren", "Kaas", "Vlees"],
  },
  {
    name: "Vleesautomaat De Hoeve",
    category: "meat",
    address: "Tilburg, Noord-Brabant",
    lat: 51.5606,
    lng: 5.0919,
    products: ["Hamburgers", "Worst", "Steak"],
  },
  {
    name: "Groentehal IJssel",
    category: "fruit",
    address: "Deventer, Overijssel",
    lat: 52.255,
    lng: 6.1636,
    products: ["Aardappels", "Sla", "Paprika"],
  },
  {
    name: "Kaasautomaat De Polder",
    category: "dairy",
    address: "Alkmaar, Noord-Holland",
    lat: 52.6324,
    lng: 4.7534,
    products: ["Oudekaas", "Jonge kaas"],
  },
];

const categoryLabels = {
  fruit: "Fruit & groente",
  dairy: "Zuivel",
  meat: "Vlees",
  mixed: "Gemengd",
};

const markerColors = {
  fruit: "#f15a5a",
  dairy: "#38bdf8",
  meat: "#f59e0b",
  mixed: "#10b981",
};

const map = L.map("map", {
  zoomControl: false,
}).setView([52.1326, 5.2913], 7.2);

L.control.zoom({ position: "bottomright" }).addTo(map);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap-bijdragers",
  maxZoom: 18,
}).addTo(map);

const markersLayer = L.layerGroup().addTo(map);

const statsEl = document.getElementById("stats");
const categoryFilter = document.getElementById("categoryFilter");
const searchInput = document.getElementById("searchInput");
const updatedEl = document.getElementById("updated");

const categories = Array.from(
  new Set(locations.map((location) => location.category))
).sort();

categories.forEach((category) => {
  const option = document.createElement("option");
  option.value = category;
  option.textContent = categoryLabels[category] ?? category;
  categoryFilter.appendChild(option);
});

const formatPopup = (location) => {
  return `
    <div class="popup">
      <strong>${location.name}</strong><br />
      <span>${location.address}</span><br />
      <em>${categoryLabels[location.category] ?? location.category}</em>
      <ul>
        ${location.products.map((product) => `<li>${product}</li>`).join("")}
      </ul>
    </div>
  `;
};

const createMarker = (location) => {
  const marker = L.circleMarker([location.lat, location.lng], {
    radius: 9,
    color: markerColors[location.category] ?? "#16a34a",
    fillColor: markerColors[location.category] ?? "#16a34a",
    fillOpacity: 0.85,
    weight: 2,
  });

  marker.bindPopup(formatPopup(location));
  return marker;
};

const renderMarkers = (data) => {
  markersLayer.clearLayers();
  data.forEach((location) => createMarker(location).addTo(markersLayer));

  statsEl.innerHTML = `
    <span>Actieve locaties</span>
    <strong>${data.length}</strong>
  `;
};

const applyFilters = () => {
  const selectedCategory = categoryFilter.value;
  const query = searchInput.value.trim().toLowerCase();

  const filtered = locations.filter((location) => {
    const matchesCategory =
      selectedCategory === "all" || location.category === selectedCategory;
    const matchesQuery =
      query === "" || location.name.toLowerCase().includes(query);

    return matchesCategory && matchesQuery;
  });

  renderMarkers(filtered);
};

categoryFilter.addEventListener("change", applyFilters);
searchInput.addEventListener("input", applyFilters);

renderMarkers(locations);

updatedEl.textContent = new Date().toLocaleDateString("nl-NL", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});
