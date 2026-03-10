import { useState } from "react";
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
//    const [notes , setNotes] = useState([
//        {id: 1, title: "Learning React", content: "React is a JS library.", date: "Mar 10" },
//        { id: 2, title: "Project Plan", content: "Build a secure notepad.", date: "Mar 09" }
//    ]);
    //const [activeNote, setActiveNote] = useState(1);
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
//                    notes={notes}
                    toggleSidebar={toggleSidebar}
                    />
            </div>
            <div className="container mb-3">

                <Routes>
                    <Route path="/about" element={<About mode={mode}/>} />
                    <Route path="/" element={<TextForm heading="Enter the text here" mode={mode} />} />
                </Routes>

            </div>

        </Router>
    );
}

export default App;