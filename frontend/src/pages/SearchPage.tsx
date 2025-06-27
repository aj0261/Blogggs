import { useSearchParams } from "react-router-dom";
import { useSearch } from "../hooks"; 
import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { Blog } from "../hooks"; 

export const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || "";
    const { loading, results } = useSearch(query);

    return (
        <div>
            <Appbar />
            <div className="max-w-screen-lg mx-auto p-8">
                <h1 className="text-3xl font-bold mb-8">
                    Search results for: <span className="text-blue-600">"{query}"</span>
                </h1>
                {loading ? (
                    <div className="space-y-4">
                        <BlogSkeleton />
                        <BlogSkeleton />
                        <BlogSkeleton />
                        <BlogSkeleton />
                        <BlogSkeleton />
                        <BlogSkeleton />
                    </div>
                ) : (
                    <div className="space-y-4">
                        {results.length > 0 ? (
                            results.map((blog: Blog) => (
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
                            ))
                        ) : (
                            <div className="text-center py-20">
                                <h2 className="text-xl font-semibold text-gray-700">No results found</h2>
                                <p className="text-gray-500 mt-2">Try searching for something else.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};