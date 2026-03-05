import {useState} from "react";
import {Link} from "react-router-dom";


export default function Header(props) {

    const [title, setTitle] = useState("");

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    }

    return (
        <nav className={`navbar navbar-expand-lg navbar-${props.mode} bg-${props.theme}`}>
            <div className="container-fluid">

                {/* Website Title Input */}
                <input
                    type="text"
                    value={title}
                    onChange={handleTitleChange}
                    className="form-control w-auto me-3"
                    placeholder="Enter Title"
                />

                {/* Navigation Links */}
                <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Home</Link>
                    </li>

                    <li className="nav-item">
                        <Link className="nav-link" to="/about">About</Link>
                    </li>
                </ul>

                {/* 🎨 Color Palette */}
                <div className="d-flex align-items-center mx-3">

                    <div
                        onClick={() => props.changeTheme("primary")}
                        style={{
                            height: "20px",
                            width: "20px",
                            backgroundColor: "blue",
                            borderRadius: "50%",
                            cursor: "pointer",
                            margin: "5px"
                        }}>
                    </div>

                    <div
                        onClick={() => props.changeTheme("success")}
                        style={{
                            height: "20px",
                            width: "20px",
                            backgroundColor: "green",
                            borderRadius: "50%",
                            cursor: "pointer",
                            margin: "5px"
                        }}
                    ></div>

                    <div
                        onClick={() => props.changeTheme("danger")}
                        style={{
                            height: "20px",
                            width: "20px",
                            backgroundColor: "red",
                            borderRadius: "50%",
                            cursor: "pointer",
                            margin: "5px"
                        }}
                    ></div>

                    <div
                        onClick={() => props.changeTheme("warning")}
                        style={{
                            height: "20px",
                            width: "20px",
                            backgroundColor: "orange",
                            borderRadius: "50%",
                            cursor: "pointer",
                            margin: "5px"
                        }}
                    ></div>

                </div>

                {/* 🌙 Dark Mode Toggle */}
                <div className={`form-check form-switch text-${props.mode === "light" ? "dark" : "light"}`}>
                    <input
                        className="form-check-input"
                        type="checkbox"
                        onClick={props.toggleMode}
                    />

                    <label className="form-check-label">
                        {props.mode === "light" ? "Enable Dark Mode" : "Enable Light Mode"}
                    </label>
                </div>

            </div>
        </nav>
    );
}