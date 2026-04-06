const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ??
    (import.meta.env.DEV ? "http://localhost:8080" : "/api");
const REQUEST_TIMEOUT_MS = 60000;

async function requestNotes(path, { method = "GET", token, payload } = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    let response;

    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                ...(payload ? { "Content-Type": "application/json" } : {}),
            },
            body: payload ? JSON.stringify(payload) : undefined,
            signal: controller.signal,
        });
    } catch (error) {
        if (error.name === "AbortError") {
            throw new Error("Request timed out. Check backend deployment status.");
        }
        throw error;
    } finally {
        clearTimeout(timeoutId);
    }

    if (response.status === 204) {
        return null;
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

export function fetchNotes(token) {
    return requestNotes("/api/notes", { token });
}

export function createNote(token, content) {
    return requestNotes("/api/notes", {
        method: "POST",
        token,
        payload: { content },
    });
}

export function updateNote(token, noteId, content) {
    return requestNotes(`/api/notes/${noteId}`, {
        method: "PUT",
        token,
        payload: { content },
    });
}

export function deleteNote(token, noteId) {
    return requestNotes(`/api/notes/${noteId}`, {
        method: "DELETE",
        token,
    });
}
