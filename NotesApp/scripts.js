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
  
  noteHolder.querySelectorAll(".noteSummaryCard").forEach(card => card.remove()); //removes all cards.
  const notesToShow = allNotes.filter(note => !note.isDeleted);
  notesToShow.forEach(note => {
    // Clone template markup
    const clone = template.content.cloneNode(true);
    console.log(note.title+" Is pinned:" + note.isPinned);
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
      saveNotes(allNotes);
      showDeletedNotes();
      showPinnedNotes();
      populateNotes();
    });
    
    // Append clone directly
    noteHolder.appendChild(clone);
  });
  updateNoteDetails(notesToShow[notesToShow.length-1]);
}
function showDeletedNotes(){
  const allNotes = getNotes();

  const noteHolder = document.getElementById("noteHolderTrash");
  const template = document.getElementById("noteCardTemplateTrash");
  noteHolder.querySelectorAll(".noteSummaryCardTrash").forEach(card => card.remove()); //removes all cards.
  const notesToShow = allNotes.filter(note => note.isDeleted);


  notesToShow.forEach(note => {
    // Clone template markup
    const clone = template.content.cloneNode(true);

    // Populate data
    clone.querySelector(".nscTopEmoji").textContent = note.emoji;
    clone.querySelector(".nscHeading").textContent = note.title;
    clone.querySelector(".nscDesc").textContent = note.content;
    clone.querySelector(".nscCat").textContent = note.category;
    clone.querySelector(".nscBotDate").textContent = dateFormatter(note.updatedAt);
    clone.querySelector(".nscTopPin").addEventListener("click", (event) => {
      note.isDeleted = !note.isDeleted;
      note.updatedAt = new Date().toISOString();
      
      saveNotes(allNotes);
      showDeletedNotes();
      populateNotes();
          
    });
    noteHolder.appendChild(clone);
  });
}

function showPinnedNotes(){
  const allNotes = getNotes();
  const noteHolder = document.getElementById("noteHolderPinned");
  const template = document.getElementById("noteCardTemplatePinned");

  noteHolder.querySelectorAll(".noteSummaryCard").forEach(card => card.remove()); //removes all cards.

  const notesToShow = allNotes.filter(note => note.isPinned);

  notesToShow.forEach(note => {
    // Clone template markup
    const clone = template.content.cloneNode(true);

    // Populate data
    clone.querySelector(".nscTopEmoji").textContent = note.emoji;
    clone.querySelector(".nscHeading").textContent = note.title;
    clone.querySelector(".nscDesc").textContent = note.content;
    clone.querySelector(".nscCat").textContent = note.category;
    clone.querySelector(".nscBotDate").textContent = "Last Updated: "+dateFormatter(note.updatedAt);
    clone.querySelector(".nscTopPin").addEventListener("click", (event) => {
      note.isPinned = !note.isPinned;
      note.updatedAt = new Date().toISOString();
      
      saveNotes(allNotes);
      //showDeletedNotes();
      showPinnedNotes();
      populateNotes();
    });
    noteHolder.appendChild(clone);
  });
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
function softDeleteNotes() {
  
  const allNotes = getNotes();
  const currentTitle = document.getElementById('ndTitleTxtID').textContent;
    
  const targetNote = allNotes.find(n => n.title === currentTitle);

  /* In JavaScript, objects are passed by reference, not by value. 
  When we run const note = allNotes.find(...), note does not hold a new copy of the data,
  it holds a reference pointing to the exact same object stored inside the allNotes array.
  So that updating the targetNote will also update the allNotes[targetNote].isDisabled and so on...*/
  
  if (targetNote) {
    
    targetNote.isDeleted = true;
    targetNote.updatedAt = new Date().toISOString();

    saveNotes(allNotes);
    populateNotes();
  }
  console.log('Note Soft Delete: '+targetNote.isDeleted);
}

document.addEventListener("DOMContentLoaded", () => {
  populateCategoryDropdown();
  populateNotes();
  showDeletedNotes();
  showPinnedNotes()

  const noteForm = document.getElementById("noteForm");
  const cancelBtn = document.getElementById("cancelBtn");
  const sidebarAddBtn = document.getElementById("sidebarAddNoteBtn");
  const editBtn = document.getElementById("ndEditbtnID");
  const deleteBtn = document.getElementById("ndDeletebtnID");

  if (sidebarAddBtn) sidebarAddBtn.addEventListener("click", addNotes);
  
  if (editBtn) editBtn.addEventListener("click", editNotes); // change the add container to edit.
  if (deleteBtn) deleteBtn.addEventListener('click', softDeleteNotes);
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