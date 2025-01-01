import { Appbar } from "../components/Appbar";
import { FaUpload } from "react-icons/fa";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export const Publish = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const navigate = useNavigate();
    const quillRef = useRef<Quill | null>(null);

    useEffect(() => {
        if (!quillRef.current) {
            quillRef.current = new Quill("#editor", {
                theme: "snow",
                placeholder: "Write your article here...",
                modules: {
                    toolbar: [
                    ["bold", "italic", "underline", "strike"], // Text formatting
                    [{ script: "sub" }, { script: "super" }], // Subscript/Superscript
                    [{ header: [1, 2, 3, false] }], // Headers
                    [{ font: [] }], // Font selection
                    [{ size: [] }], // Font size
                    [{ color: [] }, { background: [] }], // Text color and background color
                    [{ align: [] }], // Alignment (left, center, right, justify)
                    [{ list: "ordered" }, { list: "bullet" }], // Lists
                    ["blockquote", "code-block"], // Blockquote and code block
                    ["link", "image", "video"], // Media insertion
                    ["clean"], // Clear formatting
                    ],
                },
            });

            quillRef.current.on("text-change", () => {
                setDescription(quillRef.current?.root.innerHTML || "");
            });
        }
    }, []);

    const handlePublish = async () => {
        const response = await axios.post(
            `${BACKEND_URL}/api/v1/blog`,
            { title, content: description },
            {
                headers: {
                    Authorization: localStorage.getItem("token"),
                },
            }
        );
        navigate(`/blog/${response.data.id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Appbar */}
            <Appbar />

            {/* Main Container */}
            <div className="flex justify-center items-center flex-grow py-10">
                <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-4xl">
                    {/* Title Input */}
                    <input
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        className="w-full text-xl font-semibold bg-gray-100 border border-gray-300 rounded-lg px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter a catchy title..."
                    />

                    {/* Quill Editor */}
                    <div
                        id="editor"
                        className="bg-gray-100 border border-gray-300 rounded-lg min-h-[300px] p-3 overflow-auto"
                    ></div>

                    {/* Publish Button */}
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={handlePublish}
                            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 transition-all"
                        >
                            <FaUpload size={16} />
                            Publish Post
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
