import { Blog } from "../hooks"
import { Appbar } from "./Appbar"
import { Avatar } from "./BlogCard"
import DOMPurify from "dompurify";
export const FullBlog = ({ blog }: { blog: Blog }) => {
    const formattedDate = new Date(blog.publishedAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
    const sanitizedContent = DOMPurify.sanitize(blog?.content || "", {
        ADD_TAGS: ["iframe"],
        ADD_ATTR: ["allowfullscreen", "frameborder", "scrolling", "allow"],
    });
    return <div>
        <Appbar />
        <div className="flex justify-center">
            <div className="grid grid-cols-12 px-10 w-full pt-200 max-w-screen-xl pt-12">
                <div className="col-span-8">
                    <div className="text-5xl font-extrabold">
                        {blog.title}
                    </div>
                    <div className="text-slate-500 pt-2">
                        Posted on  {formattedDate}
                    </div >
                    <div className="pt-4 blog-content prose" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
                </div>
                <div className="col-span-4">
                    <div className="text-slate-600 text-lg">
                    Author  
                    </div>
                   
                    <div className="flex w-full">
                        <div className="pr-4 flex flex-col justify-center"><Avatar size = "big" name = {blog.author.name || "Anonymous"}/></div>
                        <div>
                            <div className="text-xl font-bold">
                                {blog.author.name || "Anonymous"}
                            </div>
                            <div className="pt-2 text-slate-500">
                                Randon catch phrase the author's ability to catch ability to grab user's attention
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}