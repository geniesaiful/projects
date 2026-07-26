// Get today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];

// Set the default value of the date input
document.getElementById('date').value = today;

function showRigtContent(sectionName){
    const allSections = document.querySelectorAll('.contentDiv');
        for (let i = 0; i < allSections.length; i++) {
            allSections[i].classList.remove('activeDiv');  
        }
    const selectedSection = document.getElementById(sectionName);
    selectedSection.classList.add('activeDiv');
}
