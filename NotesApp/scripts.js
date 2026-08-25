
saveNotes(tempNotes);
const tempNotesFrmLS = getNotes();
//updateNoteCard(tempNotesFrmLS[0]);
tempNotesFrmLS.forEach(updateNoteCard);

function saveNotes(notes) {
  localStorage.setItem("notesApp", JSON.stringify(notes));
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