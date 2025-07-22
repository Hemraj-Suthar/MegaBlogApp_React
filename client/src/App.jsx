import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import { useDispatch } from "react-redux";
import { login, logout } from "./store/authSlice";
import authService from "./services/auth";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function App() {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        authService.getCurrentUser()
        .then(userData => {
            if (userData) {
                dispatch(login({userData}))
            } else {
                dispatch(login())
            }
        })
        .finally(() => {setLoading(false)})
    }, []);

    return !loading ? (
        <div className="min-h-screen flex flex-wrap content-between bg-blue-300">
            <div className="w-full block">
                <Header />
                <main>
                    <Outlet />
                </main>
                <Footer />
            </div>
        </div>
    ) : null;
}

export default App;
