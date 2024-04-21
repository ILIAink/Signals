import { signal } from "@preact/signals";

// Initialize the notes store with some default notes
const notesSignal = signal([
  { id: 1, text: "Learn Preact", completed: false },
  { id: 2, text: "Check out @preact/signals", completed: false },
]);

// Function to add a new note
function addNote(text) {
  if (!text) {
    console.log("No");
    return;
  }

  const currentNotes = notesSignal.value;
  const newNote = {
    id: currentNotes.length + 1,
    text: text,
    completed: false,
  };
  notesSignal.value = [newNote, ...currentNotes];
}

// Function to toggle the 'completed' status of a note
function toggleNoteCompletion(id) {
  // Toggle the completion status of the note
  const updatedNotes = notesSignal.value.map((note) =>
    note.id === id ? { ...note, completed: !note.completed } : note
  );

  // Sort notes to move completed notes to the bottom
  updatedNotes.sort((a, b) => a.completed - b.completed);

  // Update the notesSignal with the sorted notes
  notesSignal.value = updatedNotes;
}

// Function to remove a note
function removeNote(id) {
  const filteredNotes = notesSignal.value.filter((note) => note.id !== id);
  notesSignal.value = filteredNotes;
}

export { notesSignal, addNote, toggleNoteCompletion, removeNote };
