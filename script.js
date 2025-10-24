// Initialize LocalStorage
let cleanupData = JSON.parse(localStorage.getItem("cleanupData")) || [];

// Form submission
document.getElementById("cleanupForm").addEventListener("submit", function(e) {
  e.preventDefault();
  let location = document.getElementById("location").value.trim();
  let waste = parseFloat(document.getElementById("waste").value);
  let photoInput = document.getElementById("photo");

  // Prevent duplicate locations
  if (cleanupData.some(e => e.location.toLowerCase() === location.toLowerCase())) {
    alert("Is location ke liye pehle se entry hai!");
    return;
  }

  // Handle photo
  if(photoInput.files && photoInput.files[0]) {
    let reader = new FileReader();
    reader.onload = function(event) {
      let photoData = event.target.result; // base64 string

      let entry = { location, waste, photo: photoData };
      cleanupData.push(entry);
      localStorage.setItem("cleanupData", JSON.stringify(cleanupData));

      displayEntries();
      updateChart();
      updateTotalWaste();
      updateGallery();

      document.getElementById("cleanupForm").reset();
    };
    reader.readAsDataURL(photoInput.files[0]);
  }
});

// Display entries with photo and delete button
function displayEntries() {
  let list = document.getElementById("cleanupList");
  list.innerHTML = "";
  cleanupData.forEach((entry, index) => {
    let li = document.createElement("li");
    li.innerHTML = `
      <div>
        <strong>${index+1}. Location:</strong> ${entry.location}, <strong>Waste:</strong> ${entry.waste} kg
      </div>
      ${entry.photo ? <img src="${entry.photo}" alt="Cleanup Photo"> : ""}
      <button onclick="deleteEntry(${index})">Delete</button>
    `;
    list.appendChild(li);
  });
}

// Delete entry
function deleteEntry(index) {
  cleanupData.splice(index, 1);
  localStorage.setItem("cleanupData", JSON.stringify(cleanupData));
  displayEntries();
  updateChart();
  updateTotalWaste();
  updateGallery();
}

// Total waste
function updateTotalWaste() {
  let total = cleanupData.reduce((sum, e) => sum + e.waste, 0);
  document.getElementById("totalWaste").textContent = total;
}

// Gallery update
function updateGallery() {
  let gallery = document.getElementById("photoGallery");
  gallery.innerHTML = "";
  cleanupData.forEach(entry => {
    if(entry.photo) {
      let img = document.createElement("img");
      img.src = entry.photo;
      img.alt = "Cleanup Photo";
      gallery.appendChild(img);
    }
  });
}

// Chart.js
let ctx = document.getElementById('cleanupChart').getContext('2d');
let cleanupChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: cleanupData.map(e => e.location),
        datasets: [{
            label: 'Waste Collected (kg)',
            data: cleanupData.map(e => e.waste),
            backgroundColor: 'rgba(0, 128, 128, 0.6)',
            borderColor: 'rgba(0, 128, 128, 1)',
            borderWidth: 1
        }]
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } }
});

function updateChart() {
    cleanupChart.data.labels = cleanupData.map(e => e.location);
    cleanupChart.data.datasets[0].data = cleanupData.map(e => e.waste);
    cleanupChart.update();
}

// Initial load
displayEntries();
updateChart();
updateTotalWaste();
updateGallery();