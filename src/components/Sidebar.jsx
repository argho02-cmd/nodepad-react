import { useState } from "react";
export default function Sidebar({ isOpen, toggleSidebar, mode, notes }) {
    const [search, setSearch] = useState("");

    return (
        <>
            {/* Overlay */}
            <div
                onClick={toggleSidebar}
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    backgroundColor: isOpen ? "rgba(0,0,0,0.35)" : "transparent",
                    opacity: isOpen ? 1 : 0,
                    pointerEvents: isOpen ? "auto" : "none",
                    transition: "opacity 0.3s ease",
                    zIndex: 1500
                }}
            />

            {/* Sidebar */}
            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "260px",
                    height: "100vh",
                    backgroundColor: mode === "dark" ? "#042743" : "white",
                    color: mode === "dark" ? "white" : "black",
                    transform: isOpen ? "translateX(0)" : "translateX(-100%)",
                    transition: "transform 0.3s ease",
                    zIndex: 2000,
                    boxShadow: "3px 0px 12px rgba(0,0,0,0.25)",
                    paddingTop: "20px"
                }}
            >

                {/* Sidebar Title */}
                <div className="px-4 mb-4 d-flex justify-content-between align-items-center">
                    <h5 style={{fontWeight:"600"}}>My Notes</h5>

                    <button
                        className="btn btn-sm btn-danger"
                        onClick={toggleSidebar}
                    >
                        ✕
                    </button>
                </div>
                <input
                    type="text"
                    placeholder="Search notes..."
                    className="form-control mb-3"
                    value={search}
                    onChange={(e)=>setSearch(e.target.value)}
                />

                {/* Menu */}
                <div className="px-3">
                    {notes && notes
                        .filter(note =>
                            note.title.toLowerCase().includes(search.toLowerCase())
                        )
                        .map(note => (

                            <div
                                key={note.id}
                                style={{
                                    padding:"10px",
                                    borderBottom:"1px solid #ddd",
                                    cursor:"pointer"
                                }}
                            >
                                {note.title}
                            </div>

                        ))}

                </div>
                </div>
        </>
    );
}