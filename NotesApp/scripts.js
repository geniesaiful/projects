
saveNotes(tempNotes);
const tempNotesFrmLS = getNotes();
//updateNoteCard(tempNotesFrmLS[0]);
tempNotesFrmLS.forEach(updateNoteCard);
populateCategoryDropdown();
function saveNotes(notes) {
  localStorage.setItem("notesApp", JSON.stringify(notes));
  localStorage.setItem("tempCategories", JSON.stringify(tempCategories));
}

function getNotes() {
  const data = localStorage.getItem("notesApp");
  return data ? JSON.parse(data) : [];
}

function updateNoteCard(note){
    document.getElementById('nscTopEmojiID').textContent = note.emoji;
    document.getElementById('nscHeadingID').textContent = note.title;
    document.getElementById('nscDescID').textContent = note.content;
    document.getElementById('nscCatID').textContent = note.category;
    document.getElementById('nscBotDateTime').textContent = dateFormatter(note.createdAt);

    updateNoteDetails(note);
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
    const mainNotesView = document.getElementById("contentAll");
    const formContainer = document.getElementById("addNote"); 
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
    console.log(categoriesObj);
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
  const mainNotesView = document.getElementById("contentAll");
  const formContainer = document.getElementById("addNote");

  formContainer.style.display = "none";
  mainNotesView.style.display = "block";
}
