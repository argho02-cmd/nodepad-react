import React from "react";

export default function About(props) {
    const textColor = props.mode === "light" ? "dark" : "light";
    const cardStyle = {
        backgroundColor: props.mode === "dark" ? "#0b3555" : "#f8f9fa",
        border: props.mode === "dark" ? "1px solid #1a4b72" : "1px solid #dee2e6",
    };

    return (
        <div className={`container text-${textColor} py-3`}>
            <div className="mb-4">
                <h2 className="mb-2">About Nodepad</h2>
                <p className="mb-0">
                    Nodepad is a full-stack notes application with email-verified
                    authentication, personal note storage, and persistent user sessions.
                </p>
            </div>

            <div className="row g-3">
                <div className="col-md-4">
                    <div className="card h-100 shadow-sm" style={cardStyle}>
                        <div className="card-body">
                            <h5 className="card-title">Frontend</h5>
                            <p className="card-text mb-0">
                                Built with React and Vite. Users can register, verify,
                                log in, create notes, update notes, and continue their
                                work later from the same account.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card h-100 shadow-sm" style={cardStyle}>
                        <div className="card-body">
                            <h5 className="card-title">Backend</h5>
                            <p className="card-text mb-0">
                                Powered by Spring Boot with JWT authentication,
                                email verification, protected note APIs, and PostgreSQL
                                persistence for per-user note ownership.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card h-100 shadow-sm" style={cardStyle}>
                        <div className="card-body">
                            <h5 className="card-title">Key Features</h5>
                            <p className="card-text mb-0">
                                Verified signup, secure login, note persistence,
                                multi-user separation, theme switching, and a simple
                                responsive workspace for quick note taking.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
