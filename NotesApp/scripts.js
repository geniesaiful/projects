console.log(tempNotes[0]);
console.log(Object.values(tempCategories)[0]);

updateNoteCard(tempNotes[0]);

function updateNoteCard(note){
    console.log(note.title);
    document.getElementById('nscHeadingID').textContent = note.title;
    document.getElementById('nscDescID').textContent = note.content;

    document.getElementById('nscCatID').textContent = note.category;

    document.getElementById('nscBotDateTime').textContent = dateFormatter(note.createdAt);;
    dateFormatter(note.createdAt);
}

function dateFormatter(rawDate){
    const formatted = new Date(rawDate).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }).replace(',', ' at');
    return formatted;
}