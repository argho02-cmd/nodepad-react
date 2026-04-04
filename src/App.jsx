import { useEffect, useState } from "react";
import Header from "./components/header.jsx";
import TextForm from "./components/TextForm.jsx";
import Alert from "./components/Alert.jsx";
import About from "./components/About.jsx";
import Sidebar from "./components/Sidebar.jsx";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
    authenticateUser,
    clearStoredSession,
    loadStoredSession,
    registerUser,
    storeSession,
    verifyUser,
} from "./api/auth.js";

function App() {
    const [mode, setMode] = useState("light");
    const [alert, setAlert] = useState(null);
    const [theme, setTheme] = useState("primary");
    const [notes, setNotes] = useState([]);
    const [activeNote, setActiveNote] = useState(null); // Tracks ID of note being edited
    const [text, setText] = useState("");
    const [authMode, setAuthMode] = useState("login");
    const [authStage, setAuthStage] = useState("credentials");
    const [session, setSession] = useState(() => loadStoredSession());
    const [authForm, setAuthForm] = useState({
        username: "",
        email: "",
        password: "",
        code: "",
    });
    const [authLoading, setAuthLoading] = useState(false);

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
            onAlert("Note updated successfully");
        } else {
            // Case 2: Creating a brand-new note
            const newNote = {
                title: content.substring(0, 25),
                id: Date.now(),
                content: content,
                date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
            };
            setNotes((prevNotes) => [newNote, ...prevNotes]);
            setActiveNote(newNote.id); // Set the new note as the active one
            onAlert("New note saved");
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

    const onAlert = (message, type = "success") => {
        setAlert({ msg: message, type: type });
        setTimeout(() => setAlert(null), 1500);
    };

    const toggleMode = () => {
        if (mode === "light") {
            setMode("dark");
            document.body.style.backgroundColor = "#042743";
            onAlert("Dark mode is on", "success");
        } else {
            setMode("light");
            document.body.style.backgroundColor = "white";
            onAlert("Light mode is on", "success");
        }
    };

    const handleAuthChange = (event) => {
        const { name, value } = event.target;
        setAuthForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleAuthModeChange = (nextMode) => {
        setAuthMode(nextMode);
        setAuthStage("credentials");
        setAuthForm((current) => ({
            username: nextMode === "register" ? current.username : "",
            email: current.email,
            password: "",
            code: "",
        }));
    };

    const handleAuthSubmit = async (event) => {
        event.preventDefault();
        setAuthLoading(true);

        try {
            if (authStage === "verify") {
                const response = await verifyUser({
                    email: authForm.email.trim(),
                    code: authForm.code.trim(),
                });

                const nextSession = {
                    token: response.token,
                    user: {
                        username: response.username || authForm.username.trim(),
                        email: response.email || authForm.email.trim(),
                    },
                };

                storeSession(nextSession);
                setSession(nextSession);
                setAuthStage("credentials");
                setAuthForm({
                    username: "",
                    email: nextSession.user.email,
                    password: "",
                    code: "",
                });

                onAlert(response.message || "Email verified successfully", "success");
                return;
            }

            const response = authMode === "register"
                ? await registerUser({
                    username: authForm.username.trim(),
                    email: authForm.email.trim(),
                    password: authForm.password,
                })
                : await authenticateUser({
                    email: authForm.email.trim(),
                    password: authForm.password,
                });

            if (response.requiresVerification) {
                setAuthStage("verify");
                setAuthForm((current) => ({
                    ...current,
                    password: "",
                    code: "",
                }));
                onAlert(response.message || "Verification code sent to your email", "success");
                return;
            }

            const nextSession = {
                token: response.token,
                user: {
                    username: response.username || authForm.username.trim(),
                    email: response.email || authForm.email.trim(),
                },
            };

            storeSession(nextSession);
            setSession(nextSession);
            setAuthForm({
                username: "",
                email: nextSession.user.email,
                password: "",
                code: "",
            });

            onAlert(
                response.message || "Logged in successfully",
                "success"
            );
        } catch (error) {
            onAlert(error.message || "Authentication failed", "danger");
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLogout = () => {
        clearStoredSession();
        setSession(null);
        setAuthMode("login");
        setAuthStage("credentials");
        setAuthForm({
            username: "",
            email: "",
            password: "",
            code: "",
        });
        onAlert("Logged out successfully", "success");
    };

    if (!session?.token) {
        return (
            <div className="auth-shell">
                <div className="auth-card">
                    <div className="auth-copy">
                        <p className="auth-eyebrow">Full Stack Notes</p>
                        <h1 className="auth-title">
                            {authStage === "verify" ? "Verify your email" : "Sign in to your workspace"}
                        </h1>
                        <p className="auth-subtitle">
                            {authStage === "verify"
                                ? `Enter the 6-digit code sent to ${authForm.email}.`
                                : "Use your account to access the full stack notes workspace."}
                        </p>
                    </div>

                    <div className="mb-3">
                        <Alert alert={alert} mode="light" />
                    </div>

                    {authStage !== "verify" && (
                        <div className="auth-switch mb-3">
                            <button
                                type="button"
                                className={`btn ${authMode === "login" ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => handleAuthModeChange("login")}
                            >
                                Login
                            </button>
                            <button
                                type="button"
                                className={`btn ${authMode === "register" ? "btn-primary" : "btn-outline-primary"}`}
                                onClick={() => handleAuthModeChange("register")}
                            >
                                Register
                            </button>
                        </div>
                    )}

                    <form onSubmit={handleAuthSubmit} className="auth-form">
                        {authStage === "verify" ? (
                            <div className="mb-3">
                                <label className="form-label">Verification Code</label>
                                <input
                                    type="text"
                                    name="code"
                                    value={authForm.code}
                                    onChange={handleAuthChange}
                                    className="form-control"
                                    placeholder="Enter the 6-digit code"
                                    required
                                />
                            </div>
                        ) : (
                            <>
                                {authMode === "register" && (
                                    <div className="mb-3">
                                        <label className="form-label">Username</label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={authForm.username}
                                            onChange={handleAuthChange}
                                            className="form-control"
                                            placeholder="Enter your username"
                                            required
                                        />
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={authForm.email}
                                        onChange={handleAuthChange}
                                        className="form-control"
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={authForm.password}
                                        onChange={handleAuthChange}
                                        className="form-control"
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            className="btn btn-primary w-100"
                            disabled={authLoading}
                        >
                            {authLoading
                                ? "Please wait..."
                                : authStage === "verify"
                                    ? "Verify email"
                                    : authMode === "register"
                                        ? "Create account"
                                        : "Login"}
                        </button>

                        {authStage === "verify" && (
                            <button
                                type="button"
                                className="btn btn-outline-secondary w-100 mt-2"
                                onClick={() => handleAuthModeChange("register")}
                            >
                                Back to registration
                            </button>
                        )}
                    </form>
                </div>
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
                currentUser={session.user}
                onLogout={handleLogout}
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
                    setActiveNote={setActiveNote}
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
