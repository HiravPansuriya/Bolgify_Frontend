import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "./Login.css";
import "./All.css";

const Login = ({ setUser }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null); // success or error message
    const navigate = useNavigate();

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const res = await api.post("/user/login", formData);

            // Store JWT token in localStorage
            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
            }

            if (res.data.user) {
                localStorage.setItem("user", JSON.stringify(res.data.user));
                setUser(res.data.user); // ✅ Update App state immediately
            }

            // Show success message
            toast.success("🎉 Logged in successfully!", {
                position: "top-right",
                autoClose: 3000,
            });

            navigate("/");
        }
        catch (err) {
            console.error("Login Error:", err.response?.data || err.message);
            toast.error(err.response?.data?.error || "Login failed! Please try again.", {
                position: "top-right",
                autoClose: 3000,
            });
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="containerLogin mt-5">
            <form onSubmit={handleSubmit} className="login-form">
                <h3 className="login-heading">Login to Blogify</h3>

                {/* Email Field */}
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                        Email address
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email"
                        required
                    />
                    <div className="form-text">
                        We'll never share your email with anyone else.
                    </div>
                </div>

                {/* Password Field */}
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                        Password
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        required
                    />
                </div>

                {/* Error/Success Message */}
                {message && (
                    <div
                        className={`alert ${message.type === "success" ? "alert-success" : "alert-danger"
                            }`}
                    >
                        {message.text}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default Login;
