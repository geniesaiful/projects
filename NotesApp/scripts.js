let currentEditId = null;

function navigateTo(targetId){
  document.querySelectorAll('.content').forEach(item =>{
    item.classList.toggle('active', item.id === targetId);
  });
  document.querySelectorAll('.menu-item').forEach(btn =>{
    btn.classList.toggle('active', btn.dataset.target === targetId);
  });
}

function saveNotes(notes) {
  localStorage.setItem("notesApp", JSON.stringify(notes));
  notesDataJs = notes;
}

function getNotes() {
  const data = localStorage.getItem("notesApp");
  return data ? JSON.parse(data) : [];
}

function populateCategoryDropdown() {
  const categorySelect = document.getElementById("category");
  categorySelect.innerHTML = '<option value="">Select Category</option>';

  const categoriesObj = JSON.parse(localStorage.getItem("tempCategories")) || {};
  //console.log(categoriesObj);
  Object.entries(categoriesObj).forEach(([key, cat]) => {
    const option = document.createElement("option");
    option.value = cat.name;                 // e.g., "Ideas"
    option.textContent = `${cat.emoji} ${cat.name}`;
    option.dataset.emoji = cat.emoji;        // Attach emoji to dataset
    option.dataset.key = key;                // Keep reference to key if needed
    categorySelect.appendChild(option);
  });
}
function populateNotes(){
  const allNotes = getNotes();
  const noteHolder = document.getElementById("noteHolder");
  const template = document.getElementById("noteCardTemplate");
  
  console.log(allNotes);
  //noteHolder.innerHTML = "";
  noteHolder.querySelectorAll(".noteSummaryCard").forEach(card => card.remove()); //removes all cards.
  allNotes.forEach(note => {
    // Clone template markup
    const clone = template.content.cloneNode(true);

    // Populate data
    clone.querySelector(".nscTopEmoji").textContent = note.emoji;
    clone.querySelector(".nscHeading").textContent = note.title;
    clone.querySelector(".nscDesc").textContent = note.content;
    clone.querySelector(".nscCat").textContent = note.category;
    clone.querySelector(".nscBotDate").textContent = dateFormatter(note.createdAt);
    clone.querySelector(".nscTopPin").addEventListener("click", (event) => {
     note.isPinned = note.isPinned ? false : true;
      console.log("Is pinned:" + note.isPinned);
      event.currentTarget.classList.toggle('pinned');
    });
    // Append clone directly
    noteHolder.appendChild(clone);
  });
  updateNoteDetails(allNotes[allNotes.length-1]);
}

function updateNoteCard(note){

  // document.getElementById('nscTopEmojiID').textContent = note.emoji;
  // document.getElementById('nscHeadingID').textContent = note.title;
  // document.getElementById('nscDescID').textContent = note.content;
  // document.getElementById('nscCatID').textContent = note.category;
  // document.getElementById('nscBotDateTime').textContent = dateFormatter(note.createdAt);

}
function updateNoteDetails(note){
  document.getElementById('ndEmojiID').textContent = note.emoji;
  document.getElementById('ndTitleTxtID').textContent = note.title;
  document.getElementById('ndTopDateTimeID').textContent = dateFormatter(note.updatedAt);
  document.getElementById('ndCatID').textContent = note.category;
  document.getElementById('ndTagID').textContent = note.tags;
  document.getElementById('ndDescTxtID').textContent = note.content;
  document.getElementById('ndCreatedDateID').textContent = dateFormatter(note.createdAt);
  document.getElementById('ndModifiedDateID').textContent = dateFormatter(note.updatedAt);
}
function dateFormatter(rawDate){
  const formatted = new Date(rawDate).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }).replace(',', ' at');
  return formatted;
}
function createID(){
  const timestamp = Date.now(); 
  const randomPart = Math.floor(100 + Math.random() * 900); 
  return Number(`${timestamp}${randomPart}`);
}

function addNotes(){
  currentEditId = null; 
  const form = document.getElementById("noteForm");
  form.reset();
  populateCategoryDropdown();
  navigateTo("addNoteDivID");
}
function editNotes(){
  const allNotes = getNotes();
  // Grab the note currently displayed in noteDetails
  const note = allNotes.find(n => n.title === document.getElementById('ndTitleTxtID').textContent);
  if (!note) return;

  currentEditId = note.id;
  populateCategoryDropdown();

  // Pre-fill form values
  document.getElementById("title").value = note.title;
  document.getElementById("content").value = note.content;
  document.getElementById("category").value = note.category;
  document.getElementById("tags").value = note.tags ? note.tags.join(", ") : "";

  navigateTo("addNoteDivID");
}

document.addEventListener("DOMContentLoaded", () => {
  populateCategoryDropdown();
  populateNotes();

  const noteForm = document.getElementById("noteForm");
  const cancelBtn = document.getElementById("cancelBtn");
  const sidebarAddBtn = document.getElementById("sidebarAddNoteBtn");
  const editBtn = document.getElementById("ndEditbtnID");

  if (sidebarAddBtn) sidebarAddBtn.addEventListener("click", addNotes);
  
  if (editBtn) editBtn.addEventListener("click", editNotes); // change the add container to edit.

  // Form Submission
  noteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    //get data to appropriate variables
    
    const rawTags = document.getElementById("tags").value;
    const tagsArray = rawTags
      .split(",")                    //["javascript", " ", "coding"]
      .map(tag => tag.trim())        //strips surrounding whitespaces ["javascript", "", "coding"].
      .filter(tag => tag.length > 0)  //Empty strings ("") evaluate to false and are removed["javascript", "coding"].
      .slice(0, 3);

    const categorySelect = document.getElementById("category");
    const selectedOption = categorySelect.options[categorySelect.selectedIndex];
    const nowISO = new Date().toISOString(); // Generate ISO Timestamps
    
    allNotes = getNotes();
    
    if(currentEditId){
      const note = allNotes.find(n => n.id === currentEditId);
      if(note){
        note.title = document.getElementById("title").value.trim();
        note.content = document.getElementById("content").value.trim();
        note.category = selectedOption.value;
        note.emoji = selectedOption.dataset.emoji || "";
        note.tags = tagsArray;
        note.updatedAt = nowISO;
      }
      else console.log("Error! Note not found! Somehow!!");
    }

    else{
      // Construct complete note object
      const newNote = {
        id: createID(),
        isPinned: false,
        emoji: selectedOption.dataset.emoji || "",
        title: document.getElementById("title").value.trim(),
        category: selectedOption.value,
        tags: tagsArray,
        content: document.getElementById("content").value.trim(),
        createdAt: nowISO,
        updatedAt: nowISO,
        isDeleted: false
      };
      
      allNotes.push(newNote);
    }

    saveNotes(allNotes);
    populateNotes();
    navigateTo("contentAllID");
  });

  cancelBtn.addEventListener("click", () => {
    navigateTo("contentAllID");
  });
});

document.addEventListener('click',(event)=>{
  const btnclicked = event.target.closest('[data-target]'); // where the click event happened, get the colest element's data-target attribute
  if(btnclicked){
    navigateTo(btnclicked.dataset.target);
  }
});