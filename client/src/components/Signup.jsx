import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/auth";
import { login as authLogin } from "../store/authSlice";
import { Button, Input, Logo } from "./index";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";

function Signup() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();

    // const create = async (data) => {
    //     setError("");
    //     try {
    //         const session = await authService.createAccount(data);
            
    //         if (session) {
    //             const userData = await authService.getCurrentUser(userData);
                
    //             if (userData) dispatch(login({ userData }));
    //             navigate("/");
    //         }
    //         navigate("/");
    //     } catch (error) {
    //         console.log(error.message);
            
    //         setError(error.message);
    //     }
    // };

    const create = async (data) => {
        setError("");
        try {
            // 1. Attempt to create the account (backend sets HttpOnly cookie)
            const response = await authService.createAccount(data);

            if (response.success) { // Assuming backend sends { success: true }
                // 2. If signup successful, immediately try to get the current user
                // The browser will automatically send the HttpOnly cookie.
                const userData = await authService.getCurrentUser();
                console.log(userData);
                

                if (userData) {
                    dispatch(authLogin({ userData })); // Dispatch user data to Redux store
                    navigate("/"); // Navigate to home or dashboard
                } else {
                    // This case means signup was technically successful, but getting user data failed
                    // (e.g., token expired too fast, or some other issue with /me endpoint)
                    setError("Signup successful, but failed to retrieve user session. Please try logging in.");
                }
            } else {
                setError(response.message || "Signup failed.");
            }
        } catch (err) {
            console.error("Signup error:", err);
            setError(err || "An unexpected error occurred during signup.");
        }
    };

    return (
        <div className="flex items-center justify-center">
            <div className={`mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10`}>
                <h2 className="text-center text-2xl font-bold leading-tight">Sign up to create account</h2>
                <p className="mt-2 text-center text-base text-black/60">
                    Already have an account?&nbsp;
                    <Link to="/login" className="font-medium text-primary transition-all duration-200 hover:underline">
                        Sign In
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-8 text-center">{error}</p>}
                <form onSubmit={handleSubmit(create)} className="mt-8">
                    <div className="space-y-5">
                        <Input
                            label="Full Name: "
                            placeholder="Enter your full name"
                            {...register("username", {
                                required: true,
                            })}
                        />
                        <Input
                            label="Email: "
                            placeholder="Enter your email"
                            type="email"
                            {...register("email", {
                                required: true,
                                validate: {
                                    matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                    "Email address must be a valid address",
                                }
                            })}
                        />
                        <Input
                            label="Password: "
                            placeholder="Enter your password"
                            type="password"
                            {...register("password", {
                                required: true,
                            })}
                        />
                        <Button type="submit" className="w-full">Create Account</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;
