
//saveNotes(tempNotes);
//const tempNotesFrmLS = getNotes();
//updateNoteCard(tempNotesFrmLS[0]);
//tempNotesFrmLS.forEach(updateNoteCard);
populateCategoryDropdown();
populateNotes();
console.log(notesDataJs);
function saveNotes(notes) {
  localStorage.setItem("notesApp", JSON.stringify(notes));
  notesDataJs = notes;
  console.log(notesDataJs);
}

function getNotes() {
  const data = localStorage.getItem("notesApp");
  return data ? JSON.parse(data) : [];
}
function populateNotes(){
  const allNotes = getNotes();
  const noteHolder = document.getElementById("noteHolder");
  const template = document.getElementById("noteCardTemplate");
  
  noteHolder.innerHTML = "";
  allNotes.forEach(note => {
    // Clone template markup
    const clone = template.content.cloneNode(true);

    // Populate data
    clone.querySelector(".nscTopEmoji").textContent = note.emoji;
    clone.querySelector(".nscHeading").textContent = note.title;
    clone.querySelector(".nscDesc").textContent = note.content;
    clone.querySelector(".nscCat").textContent = note.category;
    clone.querySelector(".nscBotDate").textContent = dateFormatter(note.createdAt);

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
  const mainNotesView = document.getElementById("contentAllID");
  const formContainer = document.getElementById("addNoteDivID"); 
  mainNotesView.style.display = "none";
  formContainer.style.display = "block";

  const form = document.getElementById("noteForm");
  form.reset();

  populateCategoryDropdown();
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
function closeFormView() {
  const mainNotesView = document.getElementById("contentAllID");
  const formContainer = document.getElementById("addNoteDivID");

  formContainer.style.display = "none";
  mainNotesView.style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
  const noteForm = document.getElementById("noteForm");
  const cancelBtn = document.getElementById("cancelBtn");
  const sidebarAddBtn = document.getElementById("sidebarAddNoteBtn");

  if (sidebarAddBtn) {
    sidebarAddBtn.addEventListener("click", addNotes);
  }

  // Form Submission
  noteForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Process tags into clean array (max 3 tags)
    const rawTags = document.getElementById("tags").value;
    const tagsArray = rawTags
      .split(",")
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .slice(0, 3);

    // Extract selected category details
    const categorySelect = document.getElementById("category");
    const selectedOption = categorySelect.options[categorySelect.selectedIndex];
    const categoryName = selectedOption.value;
    const categoryEmoji = selectedOption.dataset.emoji || "";

    // Generate ISO Timestamps
    const nowISO = new Date().toISOString();

    // Construct complete note object
    const newNote = {
      id: createID(),
      isPinned: false,
      emoji: categoryEmoji,
      title: document.getElementById("title").value.trim(),
      category: categoryName,
      tags: tagsArray,
      content: document.getElementById("content").value.trim(),
      createdAt: nowISO,
      updatedAt: nowISO,
      isDeleted: false
    };

    // Save note to localStorage array
    const allNotes = getNotes();
    allNotes.push(newNote);
    saveNotes(allNotes);
    
    closeFormView();
  });

  // Handle Cancel Button Click
  cancelBtn.addEventListener("click", () => {
    closeFormView();
  });
});