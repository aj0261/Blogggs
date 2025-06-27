import { Link, useNavigate } from "react-router-dom";
import { Avatar } from "./BlogCard";
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useState } from 'react';
import { MagnifyingGlassIcon, ArrowUpOnSquareIcon, PencilSquareIcon } from "@heroicons/react/24/solid";
import { BookOpen } from "lucide-react";

interface CustomJwtPayload extends JwtPayload { name?: string; id?: string; }
interface AppbarProps { onPublish?: () => void; isPublishing?: boolean; }


export const Appbar = ({ onPublish, isPublishing = false }: AppbarProps) => {
    const jwtToken = localStorage.getItem("token");
    const decoded = jwtToken ? jwtDecode<CustomJwtPayload>(jwtToken) : null;
    const authorName = decoded?.name || "Anonymous";

    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim() !== "") {
            navigate(`/search?q=${searchQuery}`);
        }
    };

    return (
        <div className="border-b flex justify-between items-center px-4 md:px-10 py-3 bg-white sticky top-0 z-50 shadow-sm">
            {/* Left Section: Logo */}
            <Link to = "./blogs">
                <div className="flex items-center space-x-2">  
                    <BookOpen className="h-8 w-8 text-black" />
                    <span className="text-2xl font-bold text-black">BLOGGGS</span>
                </div></Link>
            {/* Middle Section: Search Bar */}
            <div className="flex-1 flex justify-center px-4">
                <div className="relative w-full max-w-lg">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Search posts and authors..."
                    />
                </div>
            </div>

            {/* Right Section: Action Buttons & Avatar */}
            <div className="flex items-center gap-4 flex-shrink-0">
                {onPublish ? (
                    <button onClick={onPublish} disabled={isPublishing} className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white font-semibold rounded-full shadow-sm hover:bg-green-700 ...">
                        {isPublishing ? (<><Spinner /> Publishing...</>) : (<><ArrowUpOnSquareIcon className="h-5 w-5" />Publish</>)}
                    </button>
                ) : (
                    <>
                        {decoded && (
                            <Link to={'/my-blogs'}>
                                <button type="button" className="hidden sm:flex items-center gap-2 text-gray-600 hover:text-black font-medium rounded-full text-sm px-4 py-2.5 text-center">
                                    <PencilSquareIcon className="h-5 w-5"/>
                                    My Blogs
                                </button>
                            </Link>
                        )}
                        <Link to={'/publish'}>
                            <button type="button" className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center">
                                New Post
                            </button>
                        </Link>
                    </>
                )}

                <Link to="/settings"><Avatar name={authorName} size="big" /></Link>
            </div>
        </div>
    );
};

const Spinner = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
);