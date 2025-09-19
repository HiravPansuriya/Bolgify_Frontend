import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
// import "./Signup.css";
import "./All.css";

const Signup = () => {
    const navigate = useNavigate(); 
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false); // ✅ Loading state
    const [error, setError] = useState(null);      // ✅ Error state
    const [success, setSuccess] = useState(null);  // ✅ Success message

    // Handle form input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await api.post("user/signup", formData);
            setSuccess("Signup successful! Please verify your email.");
            console.log("Signup Success:", res.data);
            navigate("/verify-otp", {
                state: { email: formData.email }, // pass email to VerifyOTP.jsx
            });
            setFormData({ fullName: "", email: "", password: "" });

        }
        catch (err) {
            console.error("Signup Error:", err.response?.data || err.message);
            setError(err.response?.data?.error || "Signup failed! Try again.");
        }
        finally {
            setLoading(false);
        }
    };

    return (

        <div className="containerSignup mt-5">
            <form onSubmit={handleSubmit} className="signup-form">
                <h2 className="mb-4">Create Your Account</h2>

                {/* Full Name */}
                <div className="mb-3">
                    <label htmlFor="fullName" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Enter username"
                        required
                    />
                    <div className="form-text">Username should be unique.</div>
                </div>

                {/* Email */}
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
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
                    <div className="form-text">We'll never share your email with anyone else.</div>
                </div>

                {/* Password */}
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter password"
                        minLength="6"
                        required
                    />
                    <div className="form-text">Password must contain at least 6 characters.</div>
                </div>      

                {/* Error / Success Messages */}
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                >
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>
        </div>

    );
};

export default Signup;
