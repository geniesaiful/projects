let currentEditId = null;
function renderAll(){
  populateCategoryDropdown();
  populateCategorySection();
  populateTagsSection();
  populateNotes();
  showDeletedNotes();
  showPinnedNotes();
  updateStats();
  
}

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

}

function getNotes() {
  const data = localStorage.getItem("notesApp");
  return data ? JSON.parse(data) : [];
}
function saveCategories(categories){
  localStorage.setItem("notesCategories", JSON.stringify(categories));
}
function getCategories() {
  const data = localStorage.getItem("notesCategories");
  if (!data) {
    saveCategories(tempCategories);
    return tempCategories;
  }
  return JSON.parse(data);
}
function setCategory(key, name, emoji, color = null) {
  const categories = getCategories();
  
  categories[key] = {
    name: name,
    emoji: emoji,
    color: color || generateLightColor() // Auto-generates if no color passed
  };
  saveCategories(categories);
}
function generateLightColor() {
  const r = Math.floor(200 + Math.random() * 56).toString(16).padStart(2, '0');
  const g = Math.floor(200 + Math.random() * 56).toString(16).padStart(2, '0');
  const b = Math.floor(200 + Math.random() * 56).toString(16).padStart(2, '0');

  return `#${r}${g}${b}`.toUpperCase();
}
function updateStats(){
  const allNotes = getNotes();
  const validNotes = allNotes.filter(note => !note.isDeleted);
  const pinned = allNotes.filter(note => note.isPinned);
  const deleted = allNotes.filter(note => note.isDeleted);
  document.getElementById('noTopNumber').textContent=`${validNotes.length} Notes`;
  //menuAllNumber
  document.getElementById('menuAllNumber').textContent=`${validNotes.length}`;
  document.getElementById('menuPinnedNumber').textContent=`${pinned.length}`;
  document.getElementById('menuDeltedNumber').textContent=`${deleted.length}`;
  
}
function populateTagsSection(){
  //console.log("function called");
  const listContainer = document.getElementById('tagsList');
  if (!listContainer) return;
  listContainer.innerHTML = "";

  const allNotes = getNotes();
  let allTags = [];
  allNotes.forEach(note => {
    if (note.tags) {
      allTags = allTags.concat(note.tags);
    //  console.log(note.tags);
    }
  });
  const uniqueTags = [...new Set(allTags)];  //removes duplicates
  uniqueTags.forEach(tag => {
    const card = document.createElement("div");
    card.className = "tagCard";
    card.innerHTML = `<span>${tag}</span>`;
    listContainer.appendChild(card);
  });
}
function populateCategorySection()
{
  const listContainer = document.getElementById('categoriesList');
  if (!listContainer) return;

  listContainer.innerHTML = "";
  const categoriesObj = getCategories();
  
  Object.entries(categoriesObj).forEach(([key, cat]) => {
      const card = document.createElement("div");
      card.className = "categoryCard";

      card.style.backgroundColor = cat.color || '#E0E7FF';

      card.innerHTML = `<span>${cat.emoji}</span><span>${cat.name}</span>`;
      listContainer.appendChild(card);
  });
}

function populateCategoryDropdown() {
  const categorySelect = document.getElementById("category");
  const filterSelect = document.getElementById("categoryFilter");

  // Add notes page dropdown
  categorySelect.innerHTML = '<option value="">Select Category</option>';

  const categoriesObj = getCategories();
  Object.entries(categoriesObj).forEach(([key, cat]) => {
    const option = document.createElement("option");
    option.value = cat.name;               
    option.textContent = `${cat.emoji} ${cat.name}`;
    option.dataset.emoji = cat.emoji;        
    option.dataset.key = key;                
    categorySelect.appendChild(option);
  });

  // Main page Filter dropdown
  filterSelect.innerHTML = '<option value="">All Categories</option>';

  const catObjects = getCategories();
  Object.values(catObjects).forEach(cat => {
    const option = document.createElement("option");
    option.value = cat.name;
    option.textContent = cat.name; 
    filterSelect.appendChild(option);
  });

}
function populateNotes(){
  const allNotes = getNotes();
  const notesToShow = allNotes.filter(note => !note.isDeleted);
  showSelectedNotes(notesToShow,allNotes);
}
function showSelectedNotes(notesToShow,notes){
  const allNotes = notes;
  const noteHolder = document.getElementById("noteHolder");
  const template = document.getElementById("noteCardTemplate");
  
  noteHolder.querySelectorAll(".noteSummaryCard").forEach(card => card.remove()); 
  notesToShow.forEach(note => {
    // Clone template markup
    const clone = template.content.cloneNode(true);
    //console.log(note.title+" Is pinned:" + note.isPinned);
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
      saveNotes(allNotes); // This is important! we always need the allnotes alongside with the notes to show. because object reference.
      showDeletedNotes();
      showPinnedNotes();
      populateNotes();
      updateStats();
    });
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
function handleSearch() {
  const query = document.getElementById("search-input").value.toLowerCase().trim();
  const allNotes = getNotes();
  console.log('searching...');

  let filtered = allNotes.filter(note => !note.isDeleted);
  if (query) {
    filtered = filtered.filter(note => {
      const titleMatch = note.title && note.title.toLowerCase().includes(query);
      const contentMatch = note.content && note.content.toLowerCase().includes(query);
      const tagMatch = note.tags && note.tags.some(tag => tag.toLowerCase().includes(query));

      return titleMatch || contentMatch || tagMatch;
    });
  }

  showSelectedNotes(filtered,allNotes);
}
function handleCategoryFilter() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  const allNotes = getNotes();

  let activeNotes = allNotes.filter(note => !note.isDeleted);

  if (selectedCategory) {
    activeNotes = activeNotes.filter(note => note.category === selectedCategory);
  }
  showSelectedNotes(activeNotes,allNotes);
}
function handleSort() {
  const sortBy = document.getElementById("sortID").value;
  const allNotes = getNotes();
  console.log("sort caller function.")
  let notesToDisplay = allNotes.filter(note => !note.isDeleted);

  if (sortBy === "createdAt" || sortBy === "updatedAt") {
    notesToDisplay.sort((a, b) => {
      const timeA = a[sortBy] ? new Date(a[sortBy]).getTime() : 0;
      const timeB = b[sortBy] ? new Date(b[sortBy]).getTime() : 0;
      return timeB - timeA;
    });
  }

  if (sortBy === "titleAZ" || sortBy === "categoryAZ") {
    // Determine target property ('title' or 'category')
    const key = sortBy === "titleAZ" ? "title" : "category";

    notesToDisplay.sort((a, b) => {
      const textA = (a[key] || "").toLowerCase();
      const textB = (b[key] || "").toLowerCase();

      if (textA < textB) return -1;
      if (textA > textB) return 1;
      return 0;
    });
  }

  showSelectedNotes(notesToDisplay,allNotes);
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
  
  renderAll();

  const noteForm = document.getElementById("noteForm");
  const cancelBtn = document.getElementById("cancelBtn");
  const sidebarAddBtn = document.getElementById("sidebarAddNoteBtn");
  const editBtn = document.getElementById("ndEditbtnID");
  const deleteBtn = document.getElementById("ndDeletebtnID");
  const cancelCatBtn = document.getElementById("cancelCatBtn");
  //const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById("search-input");
  const filterSelect = document.getElementById("categoryFilter");
  const sortSelect = document.getElementById("sortID");
  const catForm = document.getElementById("categoryForm");


  if (catForm) {
    catForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const emoji = document.getElementById("catEmojiInput").value.trim();
      const name = document.getElementById("catNameInput").value.trim();

      if (!emoji || !name) return;

      const key = name.toLowerCase().replace(/\s+/g, '_');

      // Save object with light background color property
      setCategory(key, name, emoji);

      catForm.reset();
      populateCategorySection();
      populateCategoryDropdown();
    });
  }
  if (cancelCatBtn) {
      cancelCatBtn.addEventListener("click", () => {
          catForm.reset();
      });
  }
  if (sidebarAddBtn) sidebarAddBtn.addEventListener("click", addNotes);
  
  if (editBtn) editBtn.addEventListener("click", editNotes); // change the add container to edit.
  if (deleteBtn) deleteBtn.addEventListener('click', softDeleteNotes);
  if (searchInput) {
    searchInput.addEventListener("input", handleSearch);
  }
  if (filterSelect) {
    filterSelect.addEventListener("change", handleCategoryFilter);
  }
  if (sortSelect) {
    sortSelect.addEventListener("change", handleSort);
  }
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