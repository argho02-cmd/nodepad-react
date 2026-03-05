import { useState } from "react";
import Header from "./components/header.jsx";
import TextForm from "./components/TextForm.jsx";
import Alert from "./components/Alert.jsx";
import About from "./components/About.jsx";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {

    const [mode, setMode] = useState("light");
    const [alert, setAlert] = useState(null);
    const [theme, setTheme] = useState("primary");

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
            />

            <div style={{height:"50px"}}>
                <Alert alert={alert} mode={mode}/>
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