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
import {
    createNote,
    deleteNote,
    fetchNotes,
    updateNote,
} from "./api/notes.js";

function App() {
    const [mode, setMode] = useState("light");
    const [alert, setAlert] = useState(null);
    const [theme, setTheme] = useState("primary");
    const [notes, setNotes] = useState([]);
    const [activeNote, setActiveNote] = useState(null);
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
    const [showSidebar, setShowSidebar] = useState(false);

    const onAlert = (message, type = "success") => {
        setAlert({ msg: message, type });
        setTimeout(() => setAlert(null), 1500);
    };

    useEffect(() => {
        if (!session?.token) {
            setNotes([]);
            setText("");
            setActiveNote(null);
            return;
        }

        let isCancelled = false;

        const loadNotes = async () => {
            try {
                const nextNotes = await fetchNotes(session.token);
                if (!isCancelled) {
                    setNotes(nextNotes);
                    setText("");
                    setActiveNote(null);
                }
            } catch (error) {
                if (!isCancelled) {
                    onAlert(error.message || "Failed to load notes", "danger");
                }
            }
        };

        loadNotes();

        return () => {
            isCancelled = true;
        };
    }, [session?.token]);

    const saveNotes = async (content) => {
        if (content.trim() === "") return;

        try {
            if (activeNote) {
                const updatedNote = await updateNote(session.token, activeNote, content);
                setNotes((prevNotes) => [
                    updatedNote,
                    ...prevNotes.filter((note) => note.id !== activeNote),
                ]);
                setActiveNote(updatedNote.id);
                onAlert("Note updated successfully");
                return;
            }

            const newNote = await createNote(session.token, content);
            setNotes((prevNotes) => [newNote, ...prevNotes]);
            setActiveNote(newNote.id);
            setText(newNote.content);
            onAlert("New note saved");
        } catch (error) {
            onAlert(error.message || "Failed to save note", "danger");
        }
    };

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    };

    const onNoteSelect = (id) => {
        const selectedNote = notes.find((note) => note.id === id);
        if (selectedNote) {
            setText(selectedNote.content);
            setActiveNote(id);
            setShowSidebar(false);
        }
    };

    const handleNewNote = () => {
        setText("");
        setActiveNote(null);
        setShowSidebar(false);
    };

    const handleDeleteNote = async (noteId) => {
        try {
            await deleteNote(session.token, noteId);
            setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
            onAlert("Note deleted successfully");
        } catch (error) {
            onAlert(error.message || "Failed to delete note", "danger");
        }
    };

    const changeTheme = (color) => {
        setTheme(color);
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
                setNotes([]);
                setText("");
                setActiveNote(null);
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
            setNotes([]);
            setText("");
            setActiveNote(null);
            setSession(nextSession);
            setAuthForm({
                username: "",
                email: nextSession.user.email,
                password: "",
                code: "",
            });

            onAlert(response.message || "Logged in successfully", "success");
        } catch (error) {
            onAlert(error.message || "Authentication failed", "danger");
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLogout = () => {
        clearStoredSession();
        setSession(null);
        setNotes([]);
        setText("");
        setActiveNote(null);
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

            <div className={`sidebar-container ${showSidebar ? "" : "sidebar-hidden"}`}>
                <Sidebar
                    isOpen={showSidebar}
                    mode={mode}
                    theme={theme}
                    notes={notes}
                    setText={setText}
                    activeNote={activeNote}
                    setActiveNote={setActiveNote}
                    toggleSidebar={toggleSidebar}
                    onNoteSelect={onNoteSelect}
                    onNewNote={handleNewNote}
                    onDeleteNote={handleDeleteNote}
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
