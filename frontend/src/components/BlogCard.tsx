import { Link } from "react-router-dom";
import { ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";

interface BlogCardProps {
    authorId: string;
    authorName: string;
    title: string;
    content: string;
    publishedDate: string;
    id: string;
    upvotes: number;
    downvotes: number;
}

function extractTextFromHtml(html: string): string {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
}

export const BlogCard = ({ id,authorId, authorName, title, content, publishedDate, upvotes, downvotes }: BlogCardProps) => {
    const formattedDate = new Date(publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const plainTextContent = extractTextFromHtml(content);
    const readTime = Math.ceil(plainTextContent.trim().split(/\s+/).length / 200);

    return (
        <Link to={`/blog/${id}`} className="block group mb-4">
            <div className="bg-white p-6 rounded-lg border border-slate-200 w-full transition-all duration-200 group-hover:border-slate-400 group-hover:shadow-md">
                <div className="flex items-center text-sm mb-4">
                    <Avatar name={authorName} size="small" />
                    <Link 
                        to={`/author/${authorId}`} 
                        onClick={(e) => e.stopPropagation()} 
                        className="font-semibold text-slate-800 ml-2 hover:underline z-10 relative"
                    >
                        {authorName || "Anonymous"}
                    </Link>
                    <span className="text-slate-400 mx-2">·</span>
                    <span className="text-slate-500">{formattedDate}</span>
                </div>
                <div className="pl-9">
                    <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
                    <p className="mt-2 text-slate-600 leading-relaxed">
                        {plainTextContent.slice(0, 180) + "..."}
                    </p>
                    <div className="flex items-center gap-6 text-sm font-medium text-gray-500 pt-5 mt-4 border-t border-gray-100">
                        <span>{readTime} min read</span>
                        {/* 2. NEW: Display separate upvotes and downvotes */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-green-600">
                                <ArrowUpIcon className="h-5 w-5" />
                                <span className="font-bold">{upvotes}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-red-600">
                                <ArrowDownIcon className="h-5 w-5" />
                                <span className="font-bold">{downvotes}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
export function Circle() {
    return <div className="h-1 w-1 rounded-full bg-slate-500"></div>;
}

export function Avatar({ name, size = "small" }: { name: string, size: "small" | "big" }) {
    const sizeClasses = size === "small" ? "w-7 h-7" : "w-10 h-10";
    const textClasses = size === "small" ? "text-sm" : "text-md";
    return (
        <div className={`relative inline-flex items-center justify-center overflow-hidden bg-gray-200 rounded-full ${sizeClasses}`}>
            <span className={`font-semibold text-gray-700 ${textClasses}`}>{name ? name[0].toUpperCase() : 'A'}</span>
        </div>
    );
}