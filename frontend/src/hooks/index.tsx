import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

export interface Comment {
    id: string;
    content: string;
    createdAt: string;
    author: {
        id: string;
        name: string | null;
    }
}

export interface Blog {
    "content": string;
    "title": string;
    "id": string;
    "publishedAt": string;
    "author": {
        "name": string | null; 
        "id" : string;
        "bio"?: string | null;
    };
    "upvotes": number;        
    "downvotes": number;      
    "userVote"?: "UP" | "DOWN" | null; 
}
export const useBlog = ({ id }: { id: string }) => {
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<Blog | null>(null);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
        .then(response => {
            setBlog(response.data.post);
            setLoading(false);
        })
        .catch(error => {
            console.error("Failed to fetch blog:", error);
            setLoading(false);
        });
    }, [id]);

    return {
        loading,
        blog
    };
};

export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]);

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        })
        .then(response => {
            setBlogs(response.data.blogs);
            setLoading(false);
        })
        .catch(error => {
            console.error("Failed to fetch blogs:", error);
            setLoading(false);
        });
    }, []);

    return {
        loading,
        blogs
    };
};

export const useSearch = (query: string) => {
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState<Blog[]>([]);
    useEffect(() => {
        if (query.trim() === "") {
            setResults([]);
            setLoading(false);
            return;
        }
        const timer = setTimeout(() => {
            setLoading(true);
            axios.get(`${BACKEND_URL}/api/v1/blog/search?q=${query}`, {
                headers: { Authorization: localStorage.getItem("token") }
            })
            .then(response => {
                setResults(response.data.blogs);
            })
            .catch(err => console.error("Search failed", err))
            .finally(() => setLoading(false));
        }, 500);
        return () => clearTimeout(timer); 
    }, [query]);

    return { loading, results };
};