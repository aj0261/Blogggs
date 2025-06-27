import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Appbar } from "../components/Appbar";
import { BACKEND_URL } from "../config";
import { PencilIcon } from "@heroicons/react/24/solid";

interface UserBlog {
    id: string;
    title: string;
    publishedAt: string;
}

export const MyBlogsPage = () => {
    const [blogs, setBlogs] = useState<UserBlog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserBlogs = async () => {
            try {
                const response = await axios.get(`${BACKEND_URL}/api/v1/blog/myblogs`, {
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                });
                setBlogs(response.data.blogs);
            } catch (e) {
                console.error("Failed to fetch user blogs:", e);
            } finally {
                setLoading(false);
            }
        };
        fetchUserBlogs();
    }, []);

    if (loading) {
        return <div>Loading your blogs...</div>;
    }

    return (
        <div>
            <Appbar />
            <div className="max-w-4xl mx-auto p-8">
                <h1 className="text-4xl font-bold mb-8">My Blogs</h1>
                <div className="space-y-4">
                    {blogs.length > 0 ? (
                        blogs.map(blog => (
                            <div key={blog.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-semibold">{blog.title}</h2>
                                    <p className="text-sm text-gray-500">
                                        Published on {new Date(blog.publishedAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <Link to={`/edit/${blog.id}`}>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                        <PencilIcon className="h-4 w-4" />
                                        Edit
                                    </button>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <p>You haven't written any blogs yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};