import { useState } from "react";

export default function Sidebar({
    isOpen,
    toggleSidebar,
    mode,
    notes,
    onNoteSelect,
    onNewNote,
    activeNote,
    setActiveNote,
    setText,
    onDeleteNote,
}) {
    const [search, setSearch] = useState("");

    const handleDelete = async (id, event) => {
        event.stopPropagation();

        if (window.confirm("Are you sure you want to delete this note?")) {
            await onDeleteNote(id);

            if (activeNote === id) {
                setText("");
                setActiveNote(null);
            }
        }
    };

    return (
        <>
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
                    transition: "opacity 0.1s ease",
                    zIndex: 1500,
                }}
            />

            <div
                style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "280px",
                    height: "100vh",
                    backgroundColor: mode === "dark" ? "#042743" : "white",
                    color: mode === "dark" ? "white" : "black",
                    transform: isOpen ? "translateX(0)" : "translateX(-100%)",
                    transition: "transform 0.3s ease",
                    zIndex: 2000,
                    boxShadow: "3px 0px 12px rgba(0,0,0,0.25)",
                    padding: "20px 10px",
                }}
            >
                <div className="px-2 mb-4 d-flex justify-content-between align-items-center">
                    <h5 className="mb-0" style={{ fontWeight: "600" }}>My Notes</h5>
                    <div className="d-flex gap-2">
                        <button className="btn btn-sm btn-primary" onClick={onNewNote}>+ New</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={toggleSidebar}>X</button>
                    </div>
                </div>

                <div className="px-2 mb-3">
                    <input
                        type="text"
                        placeholder="Search notes..."
                        className={`form-control ${mode === "dark" ? "bg-dark text-light border-secondary" : ""}`}
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>

                <div className="px-2 overflow-auto" style={{ maxHeight: "calc(100vh - 150px)" }}>
                    {notes && notes
                        .filter((note) => note.title.toLowerCase().includes(search.toLowerCase()))
                        .map((note) => (
                            <div
                                key={note.id}
                                onClick={() => onNoteSelect(note.id)}
                                style={{
                                    padding: "12px",
                                    borderBottom: mode === "dark" ? "1px solid #1a3a5a" : "1px solid #eee",
                                    cursor: "pointer",
                                    borderRadius: "5px",
                                    marginBottom: "5px",
                                    position: "relative",
                                }}
                                className="note-item d-flex justify-content-between align-items-center"
                                onMouseEnter={(event) => {
                                    event.currentTarget.style.backgroundColor = mode === "dark" ? "#1a3a5a" : "#f8f9fa";
                                }}
                                onMouseLeave={(event) => {
                                    event.currentTarget.style.backgroundColor = "transparent";
                                }}
                            >
                                <div style={{ flex: 1, overflow: "hidden" }}>
                                    <div style={{ fontWeight: "500", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                                        {note.title || "Untitled Note"}
                                    </div>
                                    <div style={{ fontSize: "0.75rem", opacity: 0.6 }}>
                                        {note.content?.substring(0, 20)}...
                                    </div>
                                </div>

                                <button
                                    className="btn btn-sm"
                                    onClick={(event) => handleDelete(note.id, event)}
                                    style={{
                                        color: mode === "dark" ? "#ff4d4d" : "#dc3545",
                                        border: "none",
                                        background: "transparent",
                                    }}
                                    title="Delete Note"
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            </div>
                        ))}
                </div>
            </div>
        </>
    );
}
