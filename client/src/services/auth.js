import Login from '../components/Login.jsx';
import conf from '../conf/conf.js';

export class AuthService {

    constructor() {
        this.baseUrl = import.meta.env.VITE_BASE_URL;
    }

    async createAccount({ email, password, username }) {
        
        try {
            const response = await fetch(`${this.baseUrl}/user/signup`, {
                method: "POST",
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Signup failed");
            }
            return data; // Return the whole response data for thunk to use
        } catch (error) {
            console.error("Error in createAccount:", error);
            throw error;
        }
    }

    async login({ email, password }) {
        try {
            const response = await fetch(`${this.baseUrl}/user/login`, {
                method: "POST",
                credentials: 'include', 
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            return data;
        } catch (error) {
            console.error("Error in login:", error);
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            // Make the GET request. The browser will automatically attach the HttpOnly cookie.
            const response = await fetch(`${this.baseUrl}/user/getCurrentUser`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                if (response.status === 401) {
                    console.log("Session expired or not authorized.");
                    return null; // Return null if not authorized
                }
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch user data.");
            }

            return await response.json();
        } catch (error) {
            // If the backend returns a 401 (Not Authorized), axios will throw an error.
            // We want to gracefully handle it and return null for the UI.
            console.error("Failed to fetch current user:", error.response?.data?.message || error.message);
            // Assuming 401 means no current user, otherwise re-throw or handle differently
            if (error.response && error.response.status === 401) {
                return null; // This indicates no active session
            }
            throw error; // Re-throw other unexpected errors
        }
    }

    async logout() {
        try {
            const response = await fetch(`${this.baseUrl}/user/logout`, {
                method: "POST",
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Logout failed.");
            }

            return await response.json();
        } catch (error) {
            console.log("logout :: error", error);
        }
    }
}

const authService = new AuthService();

export default authService


