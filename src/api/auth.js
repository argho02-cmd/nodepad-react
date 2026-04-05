const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ??
    (import.meta.env.DEV ? "http://localhost:8080" : "/api");
const SESSION_KEY = "auth_session";
const REQUEST_TIMEOUT_MS = 60000;

async function postJson(path, payload) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    let response;

    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
            signal: controller.signal,
        });
    } catch (error) {
        if (error.name === "AbortError") {
            throw new Error("Request timed out. Check backend mail or deployment configuration.");
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }

    const rawBody = await response.text();
    let data = {};

    if (rawBody) {
        try {
            data = JSON.parse(rawBody);
        } catch {
            data = { message: rawBody };
        }
    }

    if (!response.ok) {
        throw new Error(
            data.detail ||
            data.message ||
            data.error ||
            "Request failed"
        );
    }

    return data;
}

export function authenticateUser(payload) {
    return postJson("/api/v1/auth/authenticate", payload);
}

export function registerUser(payload) {
    return postJson("/api/v1/auth/register", payload);
}

export function verifyUser(payload) {
    return postJson("/api/v1/auth/verify", payload);
}

export function loadStoredSession() {
    const storedSession = localStorage.getItem(SESSION_KEY);

    if (!storedSession) {
        return null;
    }

    try {
        return JSON.parse(storedSession);
    } catch {
        localStorage.removeItem(SESSION_KEY);
        return null;
    }
}

export function storeSession(session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearStoredSession() {
    localStorage.removeItem(SESSION_KEY);
}
