import { useState ,useEffect } from "react";
import axios from "axios";
import { Appbar } from "./Appbar";
import { Avatar } from "./BlogCard";
import DOMPurify from "dompurify";
import { BACKEND_URL } from "../config";
import { Comment } from "../hooks"; 
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { Blog } from "../hooks";
import { Link } from "react-router-dom";
interface FullBlogProps {
    blog: Blog;
}
export const FullBlog = ({ blog: initialBlog }: FullBlogProps) => {
    const [blog, setBlog] = useState(initialBlog);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    useEffect(() => {
        if (blog.id) {
            axios.get(`${BACKEND_URL}/api/v1/blog/${blog.id}/comments`, {
                headers: { Authorization: localStorage.getItem("token") }
            })
            .then(response => {
                setComments(response.data.comments);
            });
        }
    }, [blog.id]);
    const handleVote = async (voteType: "UP" | "DOWN") => {
        const originalBlogState = { ...blog };
        let newUpvotes = blog.upvotes;
        let newDownvotes = blog.downvotes;
        let newUserVote: "UP" | "DOWN" | null = null;
        
        const wasUpvoted = blog.userVote === "UP";
        const wasDownvoted = blog.userVote === "DOWN";

        if (voteType === "UP") {
            if (wasUpvoted) { 
                newUpvotes--;
                newUserVote = null;
            } else {
                newUpvotes++;
                if (wasDownvoted) newDownvotes--; 
                newUserVote = "UP";
            }
        } else { 
            if (wasDownvoted) { 
                newDownvotes--;
                newUserVote = null;
            } else {
                newDownvotes++;
                if (wasUpvoted) newUpvotes--;
                newUserVote = "DOWN";
            }
        }

        setBlog({ ...blog, upvotes: newUpvotes, downvotes: newDownvotes, userVote: newUserVote });

        try {
            await axios.post(`${BACKEND_URL}/api/v1/blog/${blog.id}/vote`, 
                { voteType }, 
                { headers: { Authorization: localStorage.getItem("token") } }
            );
        } catch (e) {
            console.error("Vote failed", e);
            setBlog(originalBlogState); 
        }
    };

    const handlePostComment = async () => {
        if (newComment.trim() === "") return;
        
        setIsSubmittingComment(true);
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/blog/${blog.id}/comment`,
                { content: newComment },
                { headers: { Authorization: localStorage.getItem("token") } }
            );
            setComments([response.data.comment, ...comments]);
            setNewComment("");
        } catch (e) {
            console.error("Failed to post comment", e);
            alert("Could not post your comment. Please try again.");
        } finally {
            setIsSubmittingComment(false);
        }
    };
    const formattedDate = new Date(blog.publishedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const sanitizedContent = DOMPurify.sanitize(blog.content || "", { ADD_TAGS: ["iframe"], ADD_ATTR: ["allowfullscreen", "frameborder", "scrolling", "allow"] });

    return (
        <div>
            <Appbar />
            <div className="flex justify-center">
                <div className="grid grid-cols-12 px-10 w-full max-w-screen-xl pt-12">
                    {/* Vote Component */}
                    <div className="col-span-1 flex flex-col items-center pt-16 space-y-6">
                        <div className="flex flex-col items-center gap-1">
                            <button onClick={() => handleVote("UP")} className="group p-2 rounded-full hover:bg-green-100 transition-colors">
                                <ArrowUpIcon className={`h-8 w-8 ${blog.userVote === 'UP' ? 'text-green-600' : 'text-gray-400 group-hover:text-green-500'}`} />
                            </button>
                            <span className="text-lg font-bold text-slate-700">{blog.upvotes}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                            <button onClick={() => handleVote("DOWN")} className="group p-2 rounded-full hover:bg-red-100 transition-colors">
                                <ArrowDownIcon className={`h-8 w-8 ${blog.userVote === 'DOWN' ? 'text-red-600' : 'text-gray-400 group-hover:text-red-500'}`} />
                            </button>
                            <span className="text-lg font-bold text-slate-700">{blog.downvotes}</span>
                        </div>
                    </div>

                    {/* Main Blog Content Column */}
                    <div className="col-span-8">
                        <div className="text-5xl font-extrabold">{blog.title}</div>
                        <div className="text-slate-500 pt-2">Posted on {formattedDate}</div>
                        <div className="pt-4 blog-content prose lg:prose-xl max-w-none" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />

                        {/* Integrated Comment Section */}
                        <div className="mt-20 pt-8 border-t border-slate-200">
                            <h2 className="text-3xl font-bold mb-8 text-slate-800">Responses ({comments.length})</h2>
                            
                            {/* Comment Input Form */}
                            <div className="flex items-start gap-4 mb-10">
                                <Avatar name="You" size="big" />
                                <div className="flex-1">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        rows={3}
                                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                                        placeholder="What are your thoughts?"
                                    />
                                    <button
                                        onClick={handlePostComment}
                                        disabled={isSubmittingComment}
                                        className="mt-3 flex items-center gap-2 px-4 py-2 bg-slate-800 text-white font-semibold rounded-lg shadow-sm hover:bg-black disabled:bg-gray-400"
                                    >
                                        {isSubmittingComment ? "Posting..." : "Post Comment"}
                                        {!isSubmittingComment && <PaperAirplaneIcon className="h-5 w-5"/>}
                                    </button>
                                </div>
                            </div>
                            
                            {/* Display Comments List */}
                            <div className="space-y-8">
                                {comments.map(comment => (
                                    <div key={comment.id} className="flex items-start gap-4">
                                        <Avatar name={comment.author.name || "A"} size="small" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Link to={`/author/${comment.author.id
                                                }`} onClick={(e:any) => e.stopPropagation()} className="font-bold text-slate-900">{comment.author.name}</Link>
                                                <span className="text-slate-500">·</span>
                                                <span className="text-slate-500">{new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                            </div>
                                            <p className="mt-2 text-slate-800 leading-relaxed">{comment.content}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    
                    {/* Author Sidebar */}
                    <div className="col-span-3 pl-8">
                        <div className="text-slate-600 text-lg">Author</div>
                        <div className="flex w-full pt-2">
                            <div className="pr-4 flex-shrink-0">
                                    <Link to={`/author/${blog.author.id}`}>
                                        <Avatar size="big" name={blog.author.name || "Anonymous"} />
                                    </Link>
                            </div>
                            <div>
                                <Link to={`/author/${blog.author.id}`} className="text-xl font-bold text-gray-900 hover:underline">{blog.author.name || "Anonymous"}</Link>
                                <div className="pt-2 text-slate-600">{blog.author.bio || "This author hasn't added a bio yet."}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};