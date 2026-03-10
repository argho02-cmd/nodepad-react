export default function Sidebar({ isOpen, toggleSidebar, mode }) {

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    onClick={toggleSidebar}
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.3)",
                        zIndex: 1500
                    }}
                />
            )}

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
                    boxShadow: "2px 0px 10px rgba(0,0,0,0.3)"
                }}
            >

                <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
                    <h5>My Notes</h5>

                    <button
                        className="btn btn-sm btn-danger"
                        onClick={toggleSidebar}
                    >
                        ✕
                    </button>
                </div>

                <div className="p-3">

                    <p>🏠 Home</p>
                    <p>📄 Saved Notes</p>
                    <p>📜 History</p>
                    <p>⚙ Settings</p>

                </div>

            </div>
        </>
    );
}