import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";
// import "./Admin.css";
import "./All.css";

function Admin() {
    const [data, setData] = useState({
        users: [],
        blogs: [],
        comments: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAdminData = async () => {
        try {
            setLoading(true);
            const res = await api.get("/admin");
            setData(res.data);
        } catch (err) {
            console.error("Error fetching admin dashboard:", err.response?.data || err.message);
            setError("Failed to load admin dashboard data.");
        } finally {
            setLoading(false);
        }
    };

    const deleteBlog = async (blogId) => {
        if (!window.confirm("Delete this blog?")) return;
        try {
            await api.delete(`/blog/${blogId}`);
            setData((prev) => ({
                ...prev,
                blogs: prev.blogs.filter((b) => b._id !== blogId),
            }));
        } catch (err) {
            console.error("Error deleting blog:", err.response?.data || err.message);
            alert("Failed to delete blog. Please try again.");
        }
    };

    const deleteComment = async (commentId) => {
        if (!window.confirm("Delete this comment?")) return;
        try {
            await api.delete(`/blog/comment/${commentId}`);
            setData((prev) => ({
                ...prev,
                comments: prev.comments.filter((c) => c._id !== commentId),
            }));
        } catch (err) {
            console.error("Error deleting comment:", err.response?.data || err.message);
            alert("Failed to delete comment. Please try again.");
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    if (loading) {
        return (
            <div className="admin-loading">
                <p>Loading Admin Dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-error">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="admin-container container mt-5 mb-5">
            <h2 className="mb-4">Admin Dashboard</h2>

            {/* Users Section */}
            <section className="mb-5">
                <h4>All Users ({data.users.length})</h4>
                <ul className="list-group">
                    {data.users.map((u) => (
                        <li key={u._id} className="list-group-item d-flex justify-content-between">
                            <span>
                                {u.fullName} ({u.email}) - {u.role}
                            </span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Blogs Section */}
            <section className="mb-5">
                <h4>All Blogs ({data.blogs.length})</h4>
                <ul className="list-group">
                    {data.blogs.map((b) => (
                        <li
                            key={b._id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
                            <div>
                                <strong>{b.title}</strong> by {b.createdBy?.fullName || "Unknown"}
                            </div>
                            <div>
                                <Link to={`/blog/${b._id}`} className="btn btn-sm btnV-primary me-2">
                                    View
                                </Link>
                                <button
                                    onClick={() => deleteBlog(b._id)}
                                    className="btn btn-sm btnD-danger"
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Comments Section */}
            <section>
                <h4>All Comments</h4>
                <ul className="list-group">
                    {data.comments.map((c) => (
                        <li
                            key={c._id}
                            className="list-group-item d-flex justify-content-between align-items-start"
                        >
                            <div>
                                <strong>{c.createdBy?.fullName || "Unknown"}</strong> on blog: "
                                {c.blogId?.title || "Untitled"}":
                                <br />
                                {c.content}
                            </div>
                            <button
                                onClick={() => deleteComment(c._id)}
                                className="btn btn-sm btn-danger mt-2"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}

export default Admin;
