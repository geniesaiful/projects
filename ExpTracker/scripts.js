// Get today's date in YYYY-MM-DD format to set the default value.
const today = new Date().toISOString().split('T')[0];
document.getElementById('date').value = today;

loadCategories(); // Load categories as soon as page loads


function showRigtContent(sectionName){
    const allSections = document.querySelectorAll('.contentDiv');
        for (let i = 0; i < allSections.length; i++) {
            allSections[i].classList.remove('activeDiv');  
        }
    const selectedSection = document.getElementById(sectionName);
    selectedSection.classList.add('activeDiv');
}

function addCategory(){
    const catNameEl = document.getElementById("catName");
    const catTypeEl = document.getElementById("catType");

    const catName = catNameEl.value.trim();
    const catType = catTypeEl.value;
  //  console.log("category To ADD: " +catName+" "+catType);

    if (catName === "") {
        alert("Please enter a category name.");
        return;
    }
    
    let catArray = JSON.parse(localStorage.getItem("expAppCategories")) || [];
    catArray.push({ catName: catName, catType: catType });

    localStorage.setItem("expAppCategories", JSON.stringify(catArray)); // saving in local storage named "expAppCategories"

    catNameEl.value = ""; // clears the field

    loadCategories(); // refresh
}
function loadCategories(){

    const catTableBodyEl = document.getElementById("catTableBody");
    //console.log(catTableBody.value);

    let savedCat = JSON.parse(localStorage.getItem("expAppCategories")) || [];
    catTableBodyEl.innerHTML = "";

    for (let i = 0; i < savedCat.length; i++) {
        let row = "<tr><td>" + savedCat[i].catName + "</td><td>" + savedCat[i].catType + "</td></tr>";
        catTableBody.innerHTML += row;
    }
}