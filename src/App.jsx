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
    const [notes , setNotes] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [credentials, setCredentials] = useState({ username: "", password: "" });

    useEffect(() => {
        const getNotes = localStorage.getItem("notes");
        if (getNotes) {
            try {
                // Attempt to parse the string.
                // If getNotes is the string "undefined", this will catch the error.
                setNotes(JSON.parse(getNotes));
            } catch (error) {
                // If parsing fails (e.g., malformed JSON or "undefined" string),
                // log the error and initialize notes as an empty array.
                console.error("Error parsing notes from localStorage:", error);
                setNotes([]); // Initialize with an empty array to prevent further errors
            }
        }
        // If getNotes is null (item not found), setNotes is not called,
        // and notes will remain as its initial state (empty array).
    }, []);


    useEffect(() => {
        localStorage.setItem("notes", JSON.stringify(notes));
    },[notes]);

    const saveNotes = (content) => {
        if(content.trim()==="") return;
        const newNotes = {
            id: Date.now(),
            title: content.substring(0, 25),
            content: content,
        };
        setNotes((prevNotes)=> [...prevNotes,newNotes]);
    }

    const [showSidebar, setShowSidebar] = useState(false);
    const toggleSidebar = () => {
        setShowSidebar(!showSidebar);
    }


    const changeTheme = (color) => {
        setTheme(color);
        };

    const onAlert = (message, type) => {
        setAlert({
            msg: message,
            type: type
        });
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
//login screen
    if (!isLoggedIn) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <form onSubmit={(e) => { e.preventDefault(); setIsLoggedIn(true); }}>
                    <h2>Project Login</h2>
                    <div>
                    <input
                        type="text"
                        placeholder="Username"
                        onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                    />
                    </div>
                    <div>
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                    />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        );
    }
//Notepad screen
    return (
        <Router>

            <Header
                mode={mode}
                toggleMode={toggleMode}
                theme={theme}
                changeTheme={changeTheme}
                toggleSidebar={toggleSidebar}
            />
            <div style={{height:"50px"}}>
                <Alert alert={alert} mode={mode}/>
            </div>
            <div className={`sidebar-container ${showSidebar ? ' ' : 'sidebar-hidden'}`}>
                <Sidebar
                    isOpen={showSidebar}
                    mode={mode}
                    theme={theme}
                    notes={notes}
                    toggleSidebar={toggleSidebar}
                    />
            </div>
            <div className="container mb-3">

                <Routes>
                    <Route path="/about" element={<About mode={mode}/>} />
                    <Route path="/" element={
                        <TextForm
                            heading="Enter the text here"
                            mode={mode}
                            saveNotes={saveNotes}
                        />} />
                </Routes>

            </div>

        </Router>
    );
}

export default App;