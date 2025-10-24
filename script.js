// Real beach cleanup photos (Unsplash)
const defaultPhotos = [
  "https://plus.unsplash.com/premium_photo-1663039947303-0fad26f737b8?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmVhY2glMjBjbGVhbnVwfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
  "https://images.unsplash.com/photo-1565803974275-dccd2f933cbb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmVhY2glMjBjbGVhbnVwfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=500",
  "https://media.istockphoto.com/id/113563420/photo/ocean-clean-up.jpg?s=612x612&w=0&k=20&c=HN9W_U7zqwbCGxQfewa99iz6GoSIrCrnzEipLBbePxQ="
];

// Load or initialize cleanup data
let cleanupData = JSON.parse(localStorage.getItem("cleanupData")) || [];

// Prepopulate sample entries if empty
if(cleanupData.length === 0){
    defaultPhotos.forEach((photo,index)=>{
        cleanupData.push({
            location: `Sample Beach ${index+1}`,
            waste: (index+1)*5,
            photo: photo
        });
    });
    localStorage.setItem("cleanupData", JSON.stringify(cleanupData));
}

// Form submit
document.getElementById("cleanupForm").addEventListener("submit", function(e){
    e.preventDefault();
    let location = document.getElementById("location").value.trim();
    let waste = parseFloat(document.getElementById("waste").value);

    // Prevent duplicate locations
    if(cleanupData.some(e=>e.location.toLowerCase()===location.toLowerCase())){
        alert("Is location ke liye pehle se entry hai!");
        return;
    }

    // Assign random photo
    let randomPhoto = defaultPhotos[Math.floor(Math.random()*defaultPhotos.length)];
    let entry = { location, waste, photo: randomPhoto };
    cleanupData.push(entry);
    localStorage.setItem("cleanupData", JSON.stringify(cleanupData));

    displayEntries();
    updateGallery();
    updateChart();
    updateTotalWaste();

    document.getElementById("cleanupForm").reset();
});

// Display list entries
function displayEntries(){
    let list = document.getElementById("cleanupList");
    list.innerHTML = "";
    cleanupData.forEach((entry,index)=>{
        let li = document.createElement("li");
        li.innerHTML = `
            <div><strong>${index+1}. Location:</strong> ${entry.location}, <strong>Waste:</strong> ${entry.waste} kg</div>
            <img src="${entry.photo}" alt="Cleanup Photo">
            <button onclick="deleteEntry(${index})">Delete</button>
        `;
        list.appendChild(li);
    });
}

// Delete entry
function deleteEntry(index){
    cleanupData.splice(index,1);
    localStorage.setItem("cleanupData", JSON.stringify(cleanupData));
    displayEntries();
    updateGallery();
    updateChart();
    updateTotalWaste();
}

// Update gallery
function updateGallery(){
    let gallery = document.getElementById("photoGallery");
    gallery.innerHTML = "";
    cleanupData.forEach(entry=>{
        let img = document.createElement("img");
        img.src = entry.photo;
        img.alt = "Cleanup Photo";
        gallery.appendChild(img);
    });
}

// Total waste
function updateTotalWaste(){
    let total = cleanupData.reduce((sum,e)=>sum+e.waste,0);
    document.getElementById("totalWaste").textContent = total;
}

// Chart.js
let ctx = document.getElementById("cleanupChart").getContext("2d");
let cleanupChart = new Chart(ctx,{
    type:"bar",
    data:{
        labels: cleanupData.map(e=>e.location),
        datasets:[{
            label:"Waste Collected (kg)",
            data: cleanupData.map(e=>e.waste),
            backgroundColor: "rgba(0,128,128,0.6)",
            borderColor: "rgba(0,128,128,1)",
            borderWidth:1
        }]
    },
    options:{ responsive:true, scales:{ y:{ beginAtZero:true } } }
});

function updateChart(){
    cleanupChart.data.labels = cleanupData.map(e=>e.location);
    cleanupChart.data.datasets[0].data = cleanupData.map(e=>e.waste);
    cleanupChart.update();
}

// Initial load
displayEntries();
updateGallery();
updateChart();
updateTotalWaste();