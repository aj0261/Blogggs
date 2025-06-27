import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { Avatar } from "../components/BlogCard";
import { BACKEND_URL } from "../config";
import { Blog } from "../hooks"; 
import { Spinner } from "../components/Spinner"; 

interface UserProfile {
    id: string;
    name: string | null;
    bio: string | null;
    posts: Blog[]; 
}

export const UserProfilePage = () => {
    const { id } = useParams();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            return;
        }
        axios.get(`${BACKEND_URL}/api/v1/user/${id}/profile`)
            .then(res => {
                setUser(res.data.user);
            })
            .catch(err => {
                console.error("Failed to fetch user profile:", err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);

    if (loading) {
        return (
            <div>
                <Appbar />
                <div className="h-screen flex justify-center items-center"><Spinner /></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div>
                <Appbar />
                <div className="text-center py-20">
                    <h1 className="text-2xl font-bold">User Not Found</h1>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Appbar />
            <div className="max-w-screen-lg mx-auto p-8">
                <div className="flex flex-col items-center text-center border-b border-gray-200 pb-10 mb-10">
                    <Avatar name={user.name || "A"} size="big" />
                    <h1 className="text-5xl font-extrabold mt-4">{user.name || "Anonymous"}</h1>
                    <p className="mt-4 max-w-2xl text-lg text-gray-600">
                        {user.bio || "This author hasn't written a bio yet."}
                    </p>
                </div>
                
                <h2 className="text-3xl font-bold mb-8">Posts by {user.name}</h2>
                <div className="space-y-4">
                    {user.posts.length > 0 ? (
                        user.posts.map(blog => (
                            <BlogCard
                                key={blog.id}
                                id={blog.id}
                                authorId={user.id} 
                                authorName={user.name || "Anonymous"}
                                title={blog.title}
                                content={blog.content}
                                publishedDate={blog.publishedAt}
                                upvotes={blog.upvotes}
                                downvotes={blog.downvotes}
                            />
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-10">This author hasn't published any posts yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};