import { Appbar } from "../components/Appbar";
import { FaBold, FaItalic, FaLink, FaUpload } from "react-icons/fa";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
export const Publish = () => {
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    const navigate = useNavigate();
    return (
        <div className="min-h-screen bg-gray-50">
            <Appbar />
            <div className="flex justify-center pt-10">
                <div className="max-w-screen-lg w-full bg-white shadow-lg rounded-lg p-6">
                    <input
                        onChange={(e)=>{
                            setTitle(e.target.value)
                        }}
                        type="text"
                        className="bg-gray-100 border border-gray-300 text-gray-900 text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4 mb-6 transition-transform duration-200 hover:scale-105"
                        placeholder="Enter a catchy title..."
                    />
                    {/* Text Editor */}
                    <TextEditor  onChange = {(e)=>{
                        setDescription(e.target.value);
                    }}/>
                    <button onClick={async() => {
                        const response =axios.post(`${BACKEND_URL}/api/v1/blog`,{
                            title,
                            content:description
                        },{
                            headers:{
                                Authorization:localStorage.getItem("token")
                            }
                        })
                        navigate(`/blog/${(await response).data.id}`)
                    }}
                        type="submit"
                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 focus:outline-none transition-transform duration-200 hover:scale-105"
                    >
                        <FaUpload size={16} />
                        Publish Post
                    </button>
                </div>
            </div>
        </div>
    );
};

function TextEditor({onChange}:{onChange:(e :ChangeEvent<HTMLTextAreaElement>)=>void}) {
    return (
        <div>
            <div className="w-full mb-6">
                <div className="flex items-center space-x-4 border-b border-gray-300 pb-2 mb-4">
                    <button className="text-gray-600 hover:text-blue-600 transition">
                        <FaBold size={18} />
                    </button>
                    <button className="text-gray-600 hover:text-blue-600 transition">
                        <FaItalic size={18} />
                    </button>
                    <button className="text-gray-600 hover:text-blue-600 transition">
                        <FaLink size={18} />
                    </button>
                    <button className="text-gray-600 hover:text-blue-600 transition">
                        <FaUpload size={18} />
                    </button>
                </div>
                <textarea onChange={onChange}
                    id="editor"
                    rows={10}
                    className="block w-full px-4 py-3 text-sm text-gray-800 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Write your article here..."
                    required
                />
            </div>
        </div>
    );
}
