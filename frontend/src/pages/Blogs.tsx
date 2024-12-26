import { Appbar } from "../components/Appbar";
import { BlogCard } from "../components/BlogCard";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { useBlogs } from "../hooks";
export const Blogs = () => {
    const { loading, blogs } = useBlogs();
    if (loading) {
        return <div>
            <Appbar/>
            <div className="flex justify-center">
                <div>
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
        </div>
    }
    return (
        <div>
            <Appbar />
            <div className="flex justify-center">
                <div >
                    {blogs.map(blog => <BlogCard
                        id={blog.id}
                        authorName={blog.author.name || "Anonymous"}
                        title={blog.title}
                        content={blog.content}
                        publishedDate={blog.publishedAt}
                    />)}
                    <BlogCard
                        id="xxxxxxx"
                        authorName={"Ajay"}
                        title={"title of the blog is this random thing and i dont care"}
                        content={"content of the blog ikwb erjgfnmngo vk   b k t tgtjrgnrtungkirt trjgnortgnortg tjgnrtngrtg "}
                        publishedDate={"2nd feb 2024"}
                    />
                    <BlogCard
                        id="XXXXXXxx"
                        authorName={"Ajay"}
                        title={"title of the blog is this random thing and i dont care"}
                        content={"content of the blog ikwb erjgfnmngo vk   b k t tgtjrgnrtungkirt trjgnortgnortg tjgnrtngrtg "}
                        publishedDate={"2nd feb 2024"}
                    />
                    <BlogCard
                        id="XXXXXxx"
                        authorName={"Ajay"}
                        title={"title of the blog is this random thing and i dont care"}
                        content={"content of the blog ikwb erjgfnmngo vk   b k t tgtjrgnrtungkirt trjgnortgnortg tjgnrtngrtg "}
                        publishedDate={"2nd feb 2024"}
                    />
                    <BlogCard
                        id="XXXXXxxxx"
                        authorName={"Ajay"}
                        title={"title of the blog is this random thing and i dont care"}
                        content={"content of the blog ikwb erjgfnmngo vk   b k t tgtjrgnrtungkirt trjgnortgnortg tjgnrtngrtg "}
                        publishedDate={"2nd feb 2024"}
                    />
                </div>
            </div>
        </div>
    );
}