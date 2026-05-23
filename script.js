let addNoteButton = document.querySelector(".newNote");
let themeToggleButton = document.querySelector(".theme-toggle-btn");
let dialogBox = document.querySelector(".dialogBox");
let dialogBoxTitle = document.querySelector(".newNotesTitle");

let darkModeIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Zm0-80q88 0 158-48.5T740-375q-20 5-40 8t-40 3q-123 0-209.5-86.5T364-660q0-20 3-40t8-40q-78 32-126.5 102T200-480q0 116 82 198t198 82Zm-10-270Z"/></svg>`;
let lightModeIcon = `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M565-395q35-35 35-85t-35-85q-35-35-85-35t-85 35q-35 35-35 85t35 85q35 35 85 35t85-35Zm-226.5 56.5Q280-397 280-480t58.5-141.5Q397-680 480-680t141.5 58.5Q680-563 680-480t-58.5 141.5Q563-280 480-280t-141.5-58.5ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Zm326-268Z"/></svg>`

let darkBGimage = "background-notes-app.jpg"
let darkBGVideo = "abstract.mp4";

let dialogVideo = document.querySelector(".dialogBGVideo");
let editingNoteID = null;



dialogVideo.playbackRate = 0.8;

dialogVideo.play();

addNoteButton.addEventListener("mouseenter", () => {

    addNoteButton.classList.add("fade");

    setTimeout(() => {
        addNoteButton.innerText = "Add New Note";
        addNoteButton.classList.remove("fade");
    }, 100);

});

addNoteButton.addEventListener("mouseleave", () => {

    addNoteButton.classList.add("fade");

    setTimeout(() => {
        addNoteButton.innerText = "+";
        addNoteButton.classList.remove("fade");
    }, 100);

});

//close dialog on click outside of dialog

document.addEventListener('DOMContentLoaded', function() {

    notes = loadNotes();
    
    renderNotes();

    document.querySelector(".noteForm").addEventListener('submit',createNewNote);

    document.querySelector('.dialogBox').addEventListener(('click'),function(event) {
        if(event.target === this){
            closeNewNoteDialog();
        }        
    })

})

//functions


function toggleTheme(){
    document.body.classList.toggle("darkMode");
    if(document.body.classList.contains("darkMode")) {
        themeToggleButton.innerHTML = lightModeIcon;
    }
    else {
        themeToggleButton.innerHTML = darkModeIcon;
    }

}

function openNewNoteDialog(noteID = null){


    dialogBox.showModal();
    dialogBoxTitle.focus();

    if(noteID){
        //edit mode
        const noteToEdit = notes.find(note=> note.id === noteID);
        editingNoteID = noteID;
        document.querySelector(".dialogTitle").textContent = "Edit Note";
        document.querySelector(".newNotesTitle").value = noteToEdit.title;
        document.querySelector(".newNotesContent").value = noteToEdit.content;
            
    }
    else{
        //add mode
        editingNoteID = null;  
        document.querySelector(".dialogTitle").textContent = "Add Note";
        document.querySelector(".newNotesTitle").value = "";
        document.querySelector(".newNotesContent").value = "";
        
    }


    document.querySelector(".pageContent").classList.add("bodyBlur");
    if(document.body.classList.contains("darkMode")){
        document.querySelector(".dialogBGVideo").style.display ="block";
        document.querySelector(".newNotesTitle").classList.add("darkInputFieldGlass");
        document.querySelector(".newNotesContent").classList.add("darkInputFieldGlass");
    }
    else{
        document.querySelector(".dialogBGVideo").style.display = "none";
        document.querySelector(".newNotesTitle").classList.remove("darkInputFieldGlass");
        document.querySelector(".newNotesContent").classList.remove("darkInputFieldGlass");
    }


}

function closeNewNoteDialog(){
    dialogBox.close()
    document.querySelector(".pageContent").classList.remove("bodyBlur");
}

function createNewNote(event){
    event.preventDefault() //stops refreshing the page (new learning)

    const title = document.querySelector(".newNotesTitle").value.trim();
    const content = document.querySelector(".newNotesContent").value.trim();

    if(editingNoteID){
        const noteIndex = notes.findIndex(note => note.id === editingNoteID);
        notes[noteIndex] = {
            ...notes[noteIndex],
            title : title,
            content : content,
            edit : getEditTime(Date.now())
        }

        editingNoteID = null;

        
    }
    else{
        notes.unshift({
            id:generateId(),
            title : title,
            content : content,
            edit : null
        })
            
        document.querySelector(".newNotesTitle").value = ""
        document.querySelector(".newNotesContent").value = "";
    }


    saveNotes();
    renderNotes();
    closeNewNoteDialog();

}

function getEditTime(timestamp){
    if(timestamp === null){
        return "";
    }

    const date = new Date(timestamp);

    return `
        Edited on ${date.toLocaleDateString()}
        at 
        ${date.toLocaleTimeString()}
    `

}


function generateId(){
    return Date.now().toString()
}

let notes = [];

function saveNotes(){
    localStorage.setItem('niceNotes',JSON.stringify(notes))
    console.log(localStorage.getItem("niceNotes"))
}

function renderNotes(){
    let notesContainer = document.querySelector(".notesContainer");

    if (!notes || notes.length == 0){
        notesContainer.innerHTML = `
            <div class="empty-notes">
                <h2>No notes yet</h2>
                <h5>Create your first note to get started</h5>
                <button onclick='openNewNoteDialog()'>Create new note</button>
            </div>
        `

        return;
    }

    notesContainer.innerHTML = notes.map(note=>`
            <div class='note-card'>
                <div class="note-header">
                    <div class="note-header-left">
                        <h3 class='note-title'>${note.title}</h3>
                        <p class='note-edited'>${note.edit || ""}</p>
                    </div>
                    <div class = 'note-header-right'>
                        <button onclick='editNote("${note.id}")'>
                            <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
                        </button>
                        <button onclick='deleteNote(${note.id})'>
                            <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
                        </button>
                    </div>
                </div>
                <div class = 'note-content-div'>
                    <p class='note-content'>${note.content}</p>
                </div>
                
            </div>
        `).join('');
}

function loadNotes(){
    const savedNotes = localStorage.getItem('niceNotes');
    return savedNotes ? JSON.parse(savedNotes) : [];
}

function deleteNote(id){
    notes = notes.filter(note => note.id != id);
    saveNotes();
    renderNotes();
}

function editNote(id){
    openNewNoteDialog(id);

}
