import { render } from "preact";
import { useRef, useState, useEffect } from "preact/hooks";
import { motion, AnimatePresence } from "framer-motion";
import {
  notesSignal,
  addNote,
  toggleNoteCompletion,
  removeNote as removeNoteGlobal,
} from "./Note";

export function App() {
  const inputRef = useRef();
  const [input, setInput] = useState("");
  const [notes, setNotes] = useState(notesSignal.value);

  useEffect(() => {
    const subscription = notesSignal.subscribe(setNotes);
    return () => subscription.unsubscribe();
  }, []);

  // Local function to handle the removal animation then delete the note
  function handleRemove(id) {
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === id ? { ...note, isDeleting: true } : note
      )
    );

    setTimeout(() => {
      setNotes((currentNotes) => currentNotes.filter((note) => note.id !== id));
      removeNoteGlobal(id); // Call the original removeNote function after animation
    }, 200); // Duration of the exit transition
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Notes App</h1>
      <input
        ref={inputRef}
        onChange={() => setInput(inputRef.current.value)}
        type="text"
      />
      <AnimatePresence>
        <ul>
          {notes.map((note) => (
            <motion.li
              key={note.id}
              layout // Enables automatic animation of layout changes
              initial={{ opacity: 0 }} // Start items off-screen to the left
              animate={
                note.isDeleting
                  ? { x: 0, opacity: 0, transition: { duration: 0.2 } }
                  : note.completed
                  ? "completed"
                  : "visible"
              }
              exit={{ x: -150, opacity: 0, transition: { duration: 0.2 } }} // Move to the left and fade out on exit
              variants={{
                visible: { opacity: 1, x: 0 },
                completed: { opacity: 0.5, transition: { duration: 0.5 } },
              }}
            >
              <input
                type="checkbox"
                checked={note.completed}
                onChange={() => toggleNoteCompletion(note.id)}
              />
              {note.text}
              <button
                style={{ marginLeft: "1rem" }}
                onClick={() => handleRemove(note.id)}
              >
                Delete
              </button>
            </motion.li>
          ))}
        </ul>
      </AnimatePresence>
      <button
        onClick={() => {
          inputRef.current.value = "";
          setInput("");
          addNote(input);
        }}
      >
        Add Note
      </button>
    </div>
  );
}
