import { useState, useEffect } from "react";
import Header from "./components/header.jsx";
import TextForm from "./components/TextForm.jsx";
import Alert from "./components/Alert.jsx";
import About from "./components/About.jsx";
import Sidebar from "./components/Sidebar.jsx";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
    const [mode, setMode] = useState("light");
    const [alert, setAlert] = useState(null);
    const [theme, setTheme] = useState("primary");
    const [notes, setNotes] = useState([]);
    const [activeNote, setActiveNote] = useState(null); // Tracks ID of note being edited
    const [text, setText] = useState("");

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [credentials, setCredentials] = useState({ username: "", password: "" });

    // Load notes from localStorage on startup
    useEffect(() => {
        const getNotes = localStorage.getItem("notes");
        if (getNotes) {
            try {
                setNotes(JSON.parse(getNotes));
            } catch (error) {
                console.error("Error parsing notes:", error);
                setNotes([]);
            }
        }
    }, []);

    // Save notes to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes));
    }, [notes]);

    // --- SMART SAVE LOGIC ---
    const saveNotes = (content) => {
        if (content.trim() === "") return;

        if (activeNote) {
            // Case 1: Updating an existing note
            setNotes((prevNotes) =>
                prevNotes.map((note) =>
                    note.id === activeNote
                        ? { ...note, title: content.substring(0, 25), content: content }
                        : note
                )
            );
            onAlert("Note updated successfully", "success");
        } else {
            // Case 2: Creating a brand new note
            const newNote = {
                title: content.substring(0, 25),
                id: Date.now(),
                content: content,
                date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
            };
            setNotes((prevNotes) => [newNote, ...prevNotes]);
            setActiveNote(newNote.id); // Set the new note as the active one
            onAlert("New note saved", "success");
        }
    };

    // --- SIDEBAR LOGIC ---
    const [showSidebar, setShowSidebar] = useState(false);

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const onNoteSelect = (id) => {
        const selectedNote = notes.find(note => note.id === id);
        if (selectedNote) {
            setText(selectedNote.content);
            setActiveNote(id); // Remembers we are editing this note
            setShowSidebar(false);
        }
    };

    // Reset editor for a new note
    const handleNewNote = () => {
        setText("");
        setActiveNote(null); // Clears active status so next save creates a NEW note
        setShowSidebar(false);
    };
    // Just add this simple function to App.jsx
    const updateNotesAfterDelete = (updatedNotes) => {
        setNotes(updatedNotes);
    };

    const changeTheme = (color) => {
        setTheme(color);
    };

    const onAlert = (message, type) => {
        setAlert({ msg: message, type: type });
        setTimeout(() => setAlert(null), 1500);
    };

    const toggleMode = () => {
        if (mode === "light") {
            setMode("dark");
            document.body.style.backgroundColor = "#042743";
            onAlert("Dark mode is on");
        } else {
            setMode("light");
            document.body.style.backgroundColor = "white";
            onAlert("Light mode is on");
        }
    };

    if (!isLoggedIn) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }}>
                    <h2>Project Login</h2>
                    <div className="mb-2">
                        <input
                            type="text"
                            placeholder="Username"
                            className="form-control"
                            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                        />
                    </div>
                    <div className="mb-2">
                        <input
                            type="password"
                            placeholder="Password"
                            className="form-control"
                            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Login</button>
                </form>
            </div>
        );
    }

    return (
        <Router>
            <Header
                mode={mode}
                toggleMode={toggleMode}
                theme={theme}
                changeTheme={changeTheme}
                toggleSidebar={toggleSidebar}
            />
            <div style={{ height: "50px" }}>
                <Alert alert={alert} mode={mode} />
            </div>

            <div className={`sidebar-container ${showSidebar ? '' : 'sidebar-hidden'}`}>
                <Sidebar
                    isOpen={showSidebar}
                    mode={mode}
                    theme={theme}
                    notes={notes}
                    setNotes={setNotes}
                    setText={setText}
                    activeNote={activeNote}
                    toggleSidebar={toggleSidebar}
                    onNoteSelect={onNoteSelect}
                    onNewNote={handleNewNote} // Pass the reset function
                    updateNotAfterDelete={updateNotesAfterDelete}
                />
            </div>

            <div className="container mb-3">
                <Routes>
                    <Route path="/about" element={<About mode={mode} />} />
                    <Route path="/" element={
                        <TextForm
                            heading="Note Editor"
                            mode={mode}
                            saveNotes={saveNotes}
                            text={text}
                            setText={setText}
                        />
                    } />
                </Routes>
            </div>
        </Router>
    );
}

export default App;