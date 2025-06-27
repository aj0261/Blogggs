import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks";

export const Blogs = () => {
    const { loading, blogs } = useBlogs();

    if (loading) {
        return (
            <div>
                <Appbar />
                <div className="max-w-screen-lg mx-auto p-4">
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                    <BlogSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div>
            <Appbar />
            <div className="max-w-screen-lg mx-auto p-4">
                {blogs.map(blog => (
                    <BlogCard
                        key={blog.id}
                        id={blog.id}
                        authorId={blog.author.id}
                        authorName={blog.author.name || "Anonymous"}
                        title={blog.title}
                        content={blog.content}
                        publishedDate={blog.publishedAt}
                        upvotes={blog.upvotes}
                        downvotes={blog.downvotes}
                    />
                ))}
            </div>
        </div>
    );
};