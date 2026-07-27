
// Get today's date in YYYY-MM-DD format to set the default value.
const dateToday = new Date().toISOString().split('T')[0];
document.getElementById('date').value = dateToday;

loadCategories(); // Load categories as soon as page loads

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

    const localTransactionArray = JSON.parse(localStorage.getItem('transactionRecords')) || [];
    localTransactionArray.push(record);
    
    calculate(localTransactionArray);     
    localStorage.setItem('transactionRecords',JSON.stringify(localTransactionArray));

    showLocalStorage();
}

function showLocalStorage(){
    console.table(JSON.parse(localStorage.getItem('transactionRecords')));
    //console.table(localStorage);
}
function calculate(localArray){
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

    console.log(totalBalance,totalIncome,totalExpense,savingRate);
    
    const stDivBalance = document.getElementById("stDivBalance");
    const labelBalance = document.createElement("span");
    labelBalance.className = "statusLabel";
    labelBalance.textContent = "Total Balance: ";
    const balanceDigit = document.createElement("span");
    balanceDigit.id = 'balanceDigit';
    balanceDigit.textContent = totalBalance;
    stDivBalance.appendChild(labelBalance);
    stDivBalance.appendChild(balanceDigit);

    const stDivIncome = document.getElementById("stDivIncome");
    const labelIncome = document.createElement("span");
    labelIncome.className = "statusLabel";
    labelIncome.textContent = "Total Income: ";
    const incomeDigit = document.createElement("span");
    incomeDigit.id = 'incomeDigit';
    incomeDigit.textContent = totalIncome;
    stDivIncome.appendChild(labelIncome);
    stDivIncome.appendChild(incomeDigit);

    const stDivExpense = document.getElementById("stDivExpense");
    const labelExpense = document.createElement("span");
    labelExpense.className = "statusLabel";
    labelExpense.textContent = "Total Expense: ";
    const expenseDigit = document.createElement("span");
    expenseDigit.id = 'expenseDigit';
    expenseDigit.textContent = totalExpense;
    stDivExpense.appendChild(labelExpense);
    stDivExpense.appendChild(expenseDigit);

    const stDivSavingRate = document.getElementById("stDivSavingRate");
    const labelSavingRate = document.createElement("span");
    labelSavingRate.className = "statusLabel";
    labelSavingRate.textContent = "Savings Rate: ";
    const SavingRateDigit = document.createElement("span");
    SavingRateDigit.id = 'SavingRateDigit';
    SavingRateDigit.textContent = savingRate;
    stDivSavingRate.appendChild(labelSavingRate);
    stDivSavingRate.appendChild(SavingRateDigit);


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