// Backup data
//const backupData = JSON.parse("[{"type":"income","title":"Property sell","amount":"20000","category":"Other Income","date":"2026-08-01","note":"Sold everything form my grandpa."},{"type":"expense","title":"Grocery Shopping","amount":"10.60","category":"Food","date":"2026-08-01","note":"Food and wine."},{"type":"expense","title":"Tuition Fee","amount":"700","category":"Education","date":"2026-08-02","note":"Half yearly fee."},{"type":"income","title":"Salary from Genie Logistics","amount":"2000","category":"Salary","date":"2026-08-03","note":"All I wanna say that, they don't really care about us. -MJ"},{"type":"expense","title":"Metrorail","amount":"72.5","category":"Transport","date":"2026-08-25","note":"Motijheel to Pallabi"},{"type":"expense","title":"Dentist fee","amount":"120.90","category":"Health","date":"2026-08-22","note":"Root canal and scaling."},{"type":"expense","title":"Electricity Bill","amount":"150","category":"Bills","date":"2026-07-29","note":"For June 2026"},{"type":"expense","title":"Restaurant bill","amount":"1000","category":"Food","date":"2026-07-31","note":"Monthly Restaurant bill."},{"type":"income","title":"Fiver","amount":"500","category":"Freelance","date":"2026-08-11","note":"Front end bill."},{"type":"expense","title":"Date night","amount":"215.50","category":"Food","date":"2026-08-12","note":"She ate like a monster! I will never date her again!!"},{"type":"expense","title":"Medicine","amount":"15.20","category":"Health","date":"2026-08-13","note":"The killer headache from date night. Needed medicine!!"},{"type":"expense","title":"House Rent August","amount":"3500","category":"Bills","date":"2026-08-04","note":"August 2026 in advance house rent."},{"type":"income","title":"Fiver","amount":"200","category":"Freelance","date":"2026-07-04","note":"Web ui"},{"type":"expense","title":"Test","amount":"15","category":"Salary","date":"2026-08-05","note":"okoko"}]");

// Get today's date in YYYY-MM-DD format to set the default value.
const dateToday = new Date().toISOString().split('T')[0];
document.getElementById('date').value = dateToday;
const tempDate = new Date(dateToday); 
const monthName = tempDate.toLocaleString('en-US', { month: 'long' }).toUpperCase();
document.getElementById('currentMonth').textContent = monthName; //show month on the monthly status(left bottom)

loadCategories(); // Load categories as soon as page loads

let editIndex = -1; // add or edit
let currentPage = 1; // the page position must be global to use it in different functions.

const rowsPerPage = 10;
let currentDisplayedArray = []; // Stores the full active list (filtered, searched, or all)


function showRigtContent(sectionName){
    const allSections = document.querySelectorAll('.contentDiv');
        for (let i = 0; i < allSections.length; i++) {
            allSections[i].classList.remove('activeDiv');  
        }
    const selectedSection = document.getElementById(sectionName);
    selectedSection.classList.add('activeDiv');

}

function addRecord(event){
    // the parameter event contains the triggering action, in this case form submission. by default
    // the action is to refresh the page, that is why the record was not showing in the console.
    // preventDefault() will stop that refresh. 
    event.preventDefault();

    const recType = document.getElementById("type").value.trim();
    const recTitle = document.getElementById("title").value.trim();
    const recAmount = document.getElementById("amount").value.trim();
    const recCategory = document.getElementById("catDropdown").value.trim();
    const recDate = document.getElementById("date").value.trim();
    const recNote = document.getElementById("note").value.trim();
    //console.log(recType+"\n"+recTitle+"\n"+recAmount+"\n"+recCategory+"\n"+recDate+"\n"+recNote);
    const record = {
        type: recType,
        title: recTitle,
        amount: recAmount,
        category: recCategory,
        date: recDate,
        note: recNote
    }
    // console.log(record);
    // we can use event parameter to select the triggering element by event.target. 
    // Here we want to clear the form, event.target.reset() eventually means form.reset().
    event.target.reset();
    
    // localStorage only saves data once, meaning we can not directly 'append' or 'delete' 
    // any records. we have to bring the data from there in an array, then update that 
    // array, and set them back.

    const recordArray = JSON.parse(localStorage.getItem('transactionRecords')) || [];
    if (editIndex >= 0) {
        // If editing, overwrite the existing record at editIndex
        recordArray[editIndex] = record;
    } else {
        // Otherwise, add a new record
        recordArray.push(record);
    }
    
    saveArray(recordArray);
    updateStatus(recordArray);

    // Reset UI state back to normal
    cancelEdit();

    updateTableArea(recordArray);
    //console.log("from add transaction");
    //showLocalStorage();
}

function updateStatus(array){

    let localArray = array;
    // PROBLEM: What if the localStorage is also empty?
    // POSSIBLE SOLUTION: two different functions, one for calculate and update, another for just update.
    
    updateTableArea(localArray);
    //console.log("called updateTable Area Inside UpdateStatus");
    if(localArray.length === 0){
        localArray = JSON.parse(localStorage.getItem('transactionRecords'));
    }
    
    // Total status. Right top bar.
    let totalBalance = 0;
    let totalIncome = 0;
    let totalExpense = 0;
    let savingRate = 0;

    for(let i=0; i<localArray.length; i++){
        if(localArray[i].type === "income"){
            totalIncome = totalIncome + Number(localArray[i].amount);            
            totalBalance = totalBalance + Number(localArray[i].amount);
        }
        else{
            totalBalance = totalBalance - Number(localArray[i].amount);
            totalExpense = totalExpense + Number(localArray[i].amount);
        }
    }
    totalBalance = totalBalance.toFixed(2);
    totalIncome = totalIncome.toFixed(2);
    totalExpense = totalExpense.toFixed(2);
    savingRate = ((totalBalance/totalIncome)*100).toFixed(2);
    //console.log(totalBalance,totalIncome,totalExpense,savingRate);
    const balanceDigit = document.getElementById("balanceDigit");
    balanceDigit.textContent = "$ "+totalBalance;
    const incomeDigit = document.getElementById("incomeDigit");
    incomeDigit.textContent = "$ "+totalIncome;
    const expenseDigit = document.getElementById("expenseDigit");
    expenseDigit.textContent = "$ "+totalExpense;
    const SavingRateDigit = document.getElementById("SavingRateDigit");
    SavingRateDigit.textContent = savingRate+"%";

    // Monthly calculation

    let monthlyBanlance, monthlyIncome, monthlyExpense;
    monthlyBanlance=monthlyIncome=monthlyExpense=0;
    showLocalStorage();
    let recordYearMonth;
    const currentYearMonth = dateToday.slice(0,7);

    for(let i=0;i<localArray.length;i++){
        recordYearMonth = localArray[i].date.slice(0,7);
        //console.log(localArray[i].date.slice(0,7));
        if(recordYearMonth===currentYearMonth && localArray[i].type==="income"){
            
            monthlyBanlance = monthlyBanlance + Number(localArray[i].amount);
            monthlyIncome = monthlyIncome + Number(localArray[i].amount);
            console.log(monthlyIncome,monthlyBanlance);
        }
        else if(recordYearMonth===currentYearMonth && localArray[i].type==="expense"){
            monthlyBanlance = monthlyBanlance - Number(localArray[i].amount);
            monthlyExpense = monthlyExpense + Number(localArray[i].amount);
            console.log(monthlyExpense,monthlyBanlance);
        }
    }

    document.getElementById("monthlyIncome").textContent = "$ "+monthlyIncome;
    document.getElementById("monthlyExpense").textContent = "$ "+Math.abs(monthlyExpense);
    document.getElementById("monthlyBalance").textContent = "$ "+Math.abs(monthlyBanlance);

    
}

function saveArray(array){
    localStorage.setItem('transactionRecords',JSON.stringify(array));
}

function showLocalStorage(){
    console.table(JSON.parse(localStorage.getItem('transactionRecords')));
    //console.table(localStorage);
}

function updateTableArea(array){
    //console.log("Called Update table area itself.")
    let localArray = array;
    if(localArray.length === 0){
        localArray = JSON.parse(localStorage.getItem('transactionRecords'));
    }
    currentDisplayedArray = localArray;

    const tranViewDiv = document.getElementById("transactionsTableDiv");
    tranViewDiv.innerHTML="";

    const startIndex = (currentPage-1)*rowsPerPage;
    const endIndex = startIndex+rowsPerPage;

    const slicedArray = localArray.slice(startIndex,endIndex);

    for(let i=0;i<slicedArray.length;i++){
        
        const actualIndex = startIndex + i;

        const recordDiv = document.createElement("div");
        recordDiv.className = "recordDiv";

        const imgDiv = document.createElement("div");
        imgDiv.className="recImgDiv";
        imgDiv.classList.add("recordElementDiv");
        const imgElement = document.createElement("img");
        imgElement.className="recImage";
        imgElement.classList.add("default");
        imgDiv.appendChild(imgElement);

        const recTitleTextDiv = document.createElement("div");
        recTitleTextDiv.className = "recTitleTextDiv";
        recTitleTextDiv.classList.add("recordElementDiv");
        const upperText = document.createElement("span");
        upperText.className = "recUpperText";
        upperText.textContent = slicedArray[i].title;
        const lowerText = document.createElement("span");
        lowerText.className = "recLowerText";
        lowerText.textContent = "";
        recTitleTextDiv.appendChild(upperText);
        recTitleTextDiv.appendChild(lowerText);

        const recCategoryDiv = document.createElement("div");
        recCategoryDiv.className = "recTitleTextDiv";
        recCategoryDiv.classList.add("recordElementDiv");
        const catText = document.createElement("span");
        catText.className = "recCatText";
        catText.textContent = slicedArray[i].category;
        recCategoryDiv.appendChild(catText);

        const recTypeDiv = document.createElement("div");
        recTypeDiv.className = "recTypeDiv";
        recTypeDiv.classList.add("recordElementDiv");
        const typeText = document.createElement("span");
        typeText.className="recTypeText";
        typeText.textContent=slicedArray[i].type;
        if(typeText.textContent==="income"){
            typeText.classList.add("income");
        }
        else{
            typeText.classList.add("expense");
        }
        recTypeDiv.appendChild(typeText);

        const recDateDiv = document.createElement("div");
        recDateDiv.className="recDateDiv";
        recDateDiv.classList.add("recordElementDiv");
        const dateText = document.createElement("span");
        dateText.className = "recDateText";
        dateText.textContent = slicedArray[i].date;
        recDateDiv.appendChild(dateText);

        const recAmountDiv = document.createElement("div");
        recAmountDiv.className="recAmountDiv";
        recAmountDiv.classList.add("recordElementDiv");
        const amountSign = document.createElement("span");
        amountSign.id="recAmountSign";
        const amountNumber = document.createElement("span");
        amountNumber.id="recAmountNumber";
        amountNumber.textContent = slicedArray[i].amount;

        if(typeText.textContent==="income"){
            amountSign.textContent="+";
            amountSign.style.color= "green";
            //amountNumber.classList.add("income");
            amountNumber.style.color = "green";
        }
        else{
            amountSign.textContent="-";
            amountSign.style.color="red";
            amountNumber.style.color="red";
            //amountNumber.classList.add("expense");

        }
        recAmountDiv.appendChild(amountSign);
        recAmountDiv.appendChild(amountNumber);


        const recActionDiv = document.createElement("div");
        recActionDiv.className = "recActionDiv";
        recActionDiv.classList.add("recordElementDiv");
        const recEditButton = document.createElement("img");
        recEditButton.classList.add("recButton");
        recEditButton.src="resources/edit-pencil-write-mode-svgrepo-com.svg";
        const recDeleteButton = document.createElement("img");
        recDeleteButton.classList.add("recButton");
        recDeleteButton.src = "resources/cancel-svgrepo-com.svg"
        recActionDiv.appendChild(recEditButton);
        recActionDiv.appendChild(recDeleteButton);
        
        recEditButton.onclick = function() { 
           //we cannot directly call editRecord(i), because if so it will execute as soon as the loop starts
           //this way, the button listener wait for the signal then execute.
            editRecord(actualIndex);
        }
        
        
        recDeleteButton.onclick = function(){
            const confirmDelete = confirm("Are you sure you want to delete this transaction?");
            if (confirmDelete) {
                localArray.splice(actualIndex, 1);
                saveArray(localArray);
                updateStatus(localArray);
            }
        }

        recordDiv.appendChild(imgDiv);
        recordDiv.appendChild(recTitleTextDiv);
        recordDiv.appendChild(recCategoryDiv);
        recordDiv.appendChild(recTypeDiv);
        recordDiv.appendChild(recDateDiv);
        recordDiv.appendChild(recAmountDiv);
        recordDiv.appendChild(recActionDiv);

        tranViewDiv.appendChild(recordDiv);
        //overviewTableDiv.appendChild(recordDiv); 
        //Not possible to add the record to both data table atm. because only one DOM at a time, so 
        // js will move that to the second div
    }
    const miniArray = localArray.slice(-7);
    updateOverviewTable(miniArray);
    
    const totalPage = Math.ceil(localArray.length/rowsPerPage);

    if (currentPage > totalPage) { // dont let to go beyond ininfinitly
        currentPage = totalPage;
    }

    document.getElementById("spanPageNumber").textContent = "Page"+currentPage+"of"+totalPage;
    
    document.getElementById("prevButton").disabled = (currentPage === 1);
    document.getElementById("nxtButton").disabled = (currentPage === totalPage || localArray.length === 0);
}

function changePage(pos){
    currentPage = currentPage+pos;
    updateTableArea(currentDisplayedArray);
    //console.log("from changePage");
}

function editRecord(index){

    const localArray = JSON.parse(localStorage.getItem('transactionRecords')) || [];
    const editItem = localArray[index];

    // Populate the form with current values

    document.getElementById("type").value = editItem.type;
    document.getElementById("title").value = editItem.title;
    document.getElementById("amount").value = editItem.amount;
    document.getElementById("catDropdown").value = editItem.category;
    document.getElementById("date").value = editItem.date;
    document.getElementById("note").value = editItem.note;

    // This editIndex is used because we are re using the form add Transaction, and 
    // by default it was just pushing a record at the end of the array.
    // But I have updated there, when there is a positive value, it will
    // know that it has to delete the record with the index and replace it with a new record.
    // and if it sees the -1, it will push the new record.
    editIndex = index; 

    // Adjust Form UI elements
    document.getElementById("transactionsTableDiv").style.display = "none"; // Hide table
    document.getElementById("formTitle").textContent = "Edit Transaction";  // Change title
    document.getElementById("submitBtn").textContent = "Update";            // Change submit button text
    document.getElementById("cancelBtn").style.display = "inline-block";     // Show cancel button
    document.getElementById('date').value = dateToday;
}

function cancelEdit() {
    // Reset edit state
    editIndex = -1;

    // Clear form fields
    document.getElementById("transactionForm").reset();

    // Restore UI elements
    document.getElementById("transactionsTableDiv").style.display = "block"; // Show table
    document.getElementById("formTitle").textContent = "Add Transaction";   // Reset title
    document.getElementById("submitBtn").textContent = "Add Transaction";   // Reset button text
    document.getElementById("cancelBtn").style.display = "none";            // Hide cancel button
    document.getElementById('date').value = dateToday;
}


function searchRecord(){
    const localArray = JSON.parse(localStorage.getItem('transactionRecords')) || [];
    const searchInput = document.getElementById("searchInput").value.toLowerCase().trim();
    //console.log("Search");
    if(searchInput === ""){
        updateTableArea(localArray);
        //console.log("from searchRecord");
        return;
    }
    
    // document.getElementById("buttonSearch").textContent = "Clear";
    let searchResult =[];

    for(let i=0; i<localArray.length; i++){
        let titleText = localArray[i].title.toLowerCase();
        let categoryText = localArray[i].category.toLowerCase();
        let noteText = localArray[i].note.toLowerCase();

        if(titleText.includes(searchInput) || categoryText.includes(searchInput) || noteText.includes(searchInput)){
            searchResult.push(localArray[i]);
        }

    }
    updateTableArea(searchResult);
    //console.log("from searchRecord 2");
    const searchButton = document.getElementById("buttonSearch");
    searchButton.textContent = "back";
    if(searchResult.length === 0){
            document.getElementById("transactionsTableDiv").textContent = "NO RECORD";
            console.log("No Match!");
        }
    else{
            console.log("Match Found!");
    }
    
    searchButton.onclick = function(){
        document.getElementById("searchInput").value="";
        searchButton.textContent = "Search";
        if(searchResult.length === 0) {
            document.getElementById("transactionsTableDiv").textContent = ""; 
        }
        updateTableArea(localArray); 
        //console.log("from searchRecord 3");
        searchButton.onclick = searchRecord; // the search button is now started listening again.
    }
    
    
}

function filterRecord(filter){
    const localArray = JSON.parse(localStorage.getItem('transactionRecords')) || [];
    let filteredArray =[];

    if(filter === "all"){
        updateTableArea(localArray);
        //console.log("from filterRecord");
    }
    else if(filter === "income"){
        for(let i=0; i<localArray.length;i++){
            if(localArray[i].type === "income"){
                filteredArray.push(localArray[i]);
            }
        }
        updateTableArea(filteredArray);
        //console.log("from filterRecord 2");
    }
    else if(filter === "expense"){
        for(let i=0; i<localArray.length;i++){
            if(localArray[i].type==="expense"){
                filteredArray.push(localArray[i]);
            }
        }
        updateTableArea(filteredArray);
        //console.log("from filterRecord 3");
    }
}

function updateOverviewTable(array){
    
    let localArray = array;
    const overviewTableDiv = document.getElementById("overviewTableDiv");
    overviewTableDiv.innerHTML = "";

    for(let i=0;i<localArray.length;i++){
        const recordDiv = document.createElement("div");
        recordDiv.className = "recordDiv";

        const recTitleTextDiv = document.createElement("div");
        recTitleTextDiv.className = "recTitleTextDiv";
        recTitleTextDiv.classList.add("recordElementDiv");
        const upperText = document.createElement("span");
        upperText.className = "recUpperText";
        upperText.textContent = localArray[i].title;
        const lowerText = document.createElement("span");
        lowerText.className = "recLowerText";
        lowerText.textContent = "";
        recTitleTextDiv.appendChild(upperText);
        recTitleTextDiv.appendChild(lowerText);

        const recCategoryDiv = document.createElement("div");
        recCategoryDiv.className = "recTitleTextDiv";
        recCategoryDiv.classList.add("recordElementDiv");
        const catText = document.createElement("span");
        catText.className = "recCatText";
        catText.textContent = localArray[i].category;
        recCategoryDiv.appendChild(catText);

        const recTypeDiv = document.createElement("div");
        recTypeDiv.className = "recTypeDiv";
        recTypeDiv.classList.add("recordElementDiv");
        const typeText = document.createElement("span");
        typeText.className="recTypeText";
        typeText.textContent=localArray[i].type;
        if(typeText.textContent==="income"){
            typeText.classList.add("income");
        }
        else{
            typeText.classList.add("expense");
        }
        recTypeDiv.appendChild(typeText);

        const recDateDiv = document.createElement("div");
        recDateDiv.className="recDateDiv";
        recDateDiv.classList.add("recordElementDiv");
        const dateText = document.createElement("span");
        dateText.className = "recDateText";
        dateText.textContent = localArray[i].date;
        recDateDiv.appendChild(dateText);

        const recAmountDiv = document.createElement("div");
        recAmountDiv.className="recAmountDiv";
        recAmountDiv.classList.add("recordElementDiv");
        const amountSign = document.createElement("span");
        amountSign.id="recAmountSign";
        const amountNumber = document.createElement("span");
        amountNumber.id="recAmountNumber";
        amountNumber.textContent = localArray[i].amount;

        if(typeText.textContent==="income"){
            amountSign.textContent="+";
            amountSign.style.color= "green";
            amountNumber.style.color = "green";
            //amountNumber.classList.add("income");
        }
        else{
            amountSign.textContent="-";
            amountSign.style.color="red";
            amountNumber.style.color="red";
            //amountNumber.classList.add("expense");

        }
        recAmountDiv.appendChild(amountSign);
        recAmountDiv.appendChild(amountNumber);

        recordDiv.appendChild(recTitleTextDiv);
        recordDiv.appendChild(recCategoryDiv);
        recordDiv.appendChild(recTypeDiv);
        recordDiv.appendChild(recDateDiv);
        recordDiv.appendChild(recAmountDiv);

        overviewTableDiv.appendChild(recordDiv);        
    }
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

    const catDropdownEl = document.getElementById("catDropdown"); //catDropdown
    const catTableBodyEl = document.getElementById("catTableBody");  
    //console.log(catTableBody.value);
    
    let savedCat = JSON.parse(localStorage.getItem("expAppCategories")) || [];
    
    catDropdownEl.innerHTML = '<option value="" disabled selected>Select a category</option>';
    catTableBodyEl.innerHTML = "";

   
    for (let i = 0; i < savedCat.length; i++) {
        
        // Update the dropdown
        let optionTag = document.createElement("option"); // creates <option></option>
        optionTag.value = savedCat[i].catName;
        optionTag.text = savedCat[i].catName;
        catDropdownEl.add(optionTag);
        // Update the table.
        let row = "<tr><td>" + savedCat[i].catName + "</td><td>" + savedCat[i].catType + "</td></tr>";
        catTableBody.innerHTML += row;
    }
}

function darkMode(){

    document.body.classList.toggle("darkMode");
    console.log("clicked");
}