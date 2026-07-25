function addTask(){
    const inpfld = document.getElementById("inpfield");
    const inptxt = inpfld.value.trim();
    
    if (inptxt === "") {
        alert("Write something!");
        return;
    }
    
    createRow(inptxt, false);
    
    taskCounter();
    inpfld.value = "";
}


function createRow(text, isChecked) {
    const taskBody = document.getElementById("task_body");
    
    // const noTaskMsg = document.getElementById("noTask");
    // if(noTaskMsg){
    //     noTaskMsg.remove();
    // }

    const taskDiv = document.createElement("div");
    taskDiv.className = "taskDiv";
    
    const checkBox = document.createElement("input");
    checkBox.type = "checkbox";
    checkBox.checked = isChecked;

    const textSpan = document.createElement("span");
    textSpan.textContent = text;
    textSpan.className = "todotextspan"; // Gave a class name so that can be targetet.
    
    // check on the loading time
    if (isChecked) {
        textSpan.style.textDecoration = "line-through";
    }

    checkBox.onchange = function (){
        if(checkBox.checked){
            textSpan.style.textDecoration = "line-through";
        }
        else{
            textSpan.style.textDecoration = "none";
        }
        taskCounter(); 
    };
    
    const dltbtn = document.createElement("img");
    dltbtn.src = "images/delete-svgrepo-com.svg";
    dltbtn.className = "deleteBtn";

    const editBtn = document.createElement("img");
    editBtn.src = "images/edit-pen-write-1-svgrepo-com.svg";
    editBtn.className="editBtn";

    editBtn.onclick = function(){

        // When edit is pressed, the span is replaced with an input field 
        // and the buttons will be replaced with done and cancel buttons.
        // Done will save the text and replace the input field with the span.
        // Cancel will just replace the intput to previous span again.
        // Buttons will be replaced with the previous buttons.
        
        const doneBtn = document.createElement("img");
        doneBtn.src = "images/ok-svgrepo-com.svg";
        doneBtn.className="doneButton";

        const cancelBtn = document.createElement("img");
        cancelBtn.src = "images/cancel-svgrepo-com.svg";
        cancelBtn.className = "cancelButton";
        
        
        const editInput = document.createElement("input");
        editInput.type = "text";
        editInput.className = "editInput";
        editInput.value = textSpan.textContent; //takes the texts from span
        
        textSpan.replaceWith(editInput); // span is replaced with the input field
        editBtn.replaceWith(doneBtn);
        dltbtn.replaceWith(cancelBtn);
        
        editInput.onkeydown = function(){
        if (event.key === "Enter") {
                    editFn();
            }
        };
        doneBtn.onclick = function(){
            editFn();
        };
        cancelBtn.onclick = function(){
            doneBtn.replaceWith(editBtn);
            cancelBtn.replaceWith(dltbtn);
            editInput.replaceWith(textSpan);
            taskCounter();
        }
        function editFn(){
            const newText = editInput.value.trim();
            if(newText===""){
                alert("Write something!!");
                //textSpan.textContent = newText;
                editInput.replaceWith(textSpan);
            }
            else{
                textSpan.textContent = newText;
                editInput.replaceWith(textSpan);
            }
       
            doneBtn.replaceWith(editBtn);
            cancelBtn.replaceWith(dltbtn);
            taskCounter();
        }
        
    }
    
    dltbtn.onclick = function(){
        taskDiv.remove();
        
        if (taskBody.children.length === 0) {
            taskBody.innerHTML = '<p id="noTask">Empty</p>';
        }
        taskCounter();
    };

    taskDiv.appendChild(checkBox);
    taskDiv.appendChild(textSpan);
    taskDiv.appendChild(editBtn);
    taskDiv.appendChild(dltbtn);
    
    taskBody.appendChild(taskDiv);
}

// This is also the function for saving state
function taskCounter(){
     
    const allCkbox = document.querySelectorAll('.taskDiv input[type = "checkbox"]'); 
    let totaltsk = document.getElementsByClassName("taskDiv").length;
    
    const noTaskMsg = document.getElementById("noTask");
    
    if (totaltsk === 0) {
        noTaskMsg.style.display = "block"; // element's dispaly property can hide or unhide element.
    } else {
        noTaskMsg.style.display = "none";
    }
    
    
    let compCkbox = 0;
    const saveArray = [];
    
    for(let i=0; i<allCkbox.length; i++){
        if(allCkbox[i].checked){
            compCkbox++;
        }
        const spanText = allCkbox[i].parentElement.querySelector("span").textContent;
        saveArray.push({ text: spanText, checked: allCkbox[i].checked });
    }

    localStorage.setItem("savedList", JSON.stringify(saveArray));

    const remaingtsk = totaltsk - compCkbox;
    let taskRatio = ((compCkbox / totaltsk) * 100).toFixed(2); // because 1/3 goes 0.333333... 
                                                                // so this will roud up until tow decimal 33.33
    
    //console.log(taskRatio);

    document.getElementById("totalTask").textContent = totaltsk;
    document.getElementById("doneTask").textContent = compCkbox;
    document.getElementById("remTask").textContent = remaingtsk;
    document.getElementById("taskRatio").textContent = taskRatio;
}

function loadTasks() {
    const rawData = localStorage.getItem("savedList");
    if (!rawData) return; 
    
    const parsedArray = JSON.parse(rawData);
    for (let i = 0; i < parsedArray.length; i++) {
        createRow(parsedArray[i].text, parsedArray[i].checked);
    }
    taskCounter();
}
        
function filterTasks(filterType) {
    // An element can be hidden using their "display" attribute.
    // "display: none" will make that element hidden. 
    // "dispaly: flex(or other)" will unhide them.

    // take all the task rows from taskDiv.
    const allTasks = document.getElementsByClassName("taskDiv");

    // Go throug all tasks, check what to filter, check if the checkbox is ticked, show the tasks accordingly.
    for (let i = 0; i < allTasks.length; i++) {
        
        const taskRow = allTasks[i]; // take one task in taskrow variable

        const checkBox = taskRow.querySelector('input[type="checkbox"]'); //take the checkbox form the row.

        if (filterType === "all") {
            
            taskRow.style.display = "flex";
        }
        else if (filterType === "completed") {
            
            if (checkBox.checked) {
                taskRow.style.display = "flex";
            } else {
                taskRow.style.display = "none";
            }
        }
        else if (filterType === "remaining") {
            if (!checkBox.checked) {
                taskRow.style.display = "flex";
            } else {
                taskRow.style.display = "none";
            }
        }
    }
}

function clearChecked(){
    // so if we delete a task using getElements, the problem arises that the taskrow will be deleted live while the for loop is still running!
    // it causes the problem of shifting the index. meaning the allTasks[2] will become allTasks[1], while the i will be in 2.
    // querySelectorAll method will return a snapshot, a static nodelist, which stays inside the javascript until the loop is done.
    const allTasks = document.querySelectorAll(".taskDiv");
    
    for(let i=0; i<allTasks.length; i++){
        const taskRow = allTasks[i];
        const checkBox = taskRow.querySelector('input[type="checkbox"]'); // the querySelector method returns the first element only. 
                                                                            // while querySelectorAll returns a list of all that type.
        if(checkBox.checked){
            taskRow.remove();
            //console.log("Cleared Task" + (i+1));
        }
    }
    taskCounter();

}
function nightMode(){
    // const allTasks = document.getElementsByClassName("taskDiv");
    // document.body.style.backgroundColor = "black";
    // document.querySelector('h2').style.color= "white";
    // //bodyAll.classList.add("dark-theme");
    // //titleText.classList.add("dark-theme");
    // console.log("cchecked");
    // for(let i=0;i<allTasks.length; i++)
    // {
    //     const taskRow = allTasks[i];
    //     taskRow.classList.add("dark-theme");        
    // }
 
    // taskCounter();
    // getElementsByclassName etc will return kind of array. so if there is a single element we can use getELementbyId instead.

    document.body.classList.toggle("darkMode");
}
