import { Link } from "react-router-dom";
import DOMPurify from "dompurify";
interface BlogCardProps{
    authorName : string;
    title : string;
    content : string;
    publishedDate : string;
    id:string;
}
export const BlogCard = ({
    id,
    authorName,
    title,
    content,
    publishedDate
}:BlogCardProps) =>{
    const formattedDate = new Date(publishedDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
    const sanitizedContent = DOMPurify.sanitize(content || "", {
        ADD_TAGS: ["iframe"],
        ADD_ATTR: ["allowfullscreen", "frameborder", "scrolling", "allow"],
    });
    return(
        <Link to={`/blog/${id}`}>
        <div className="p-2 border-b border-slate-400 pb-4 w-screen max-w-screen-md">
            <div className="flex">
                <div>
                    <Avatar name = {authorName} size="small"/>
                </div>
                <div className="font-extralight pl-2 text-sm flex justify-center flex-col">{authorName}</div>
                <div className="flex justify-center flex-col pl-2">
                    <Circle/>
                </div>
                <div className="pl-2 flex justify-center flex-col font-thin text-slate-500 text-sm">
                    {formattedDate}
                </div>
            </div> 
            <div className = "text-xl font-semibold pt-2">
                {title}
            </div> 
            <div className="text-md font-thin">
                {sanitizedContent.slice(0,100)+"..."}
            </div>
            <div className="text-slate-500 text-sm font-thin pt-2">
                {`${Math.ceil(content.length/100)} minute(s) read`}
            </div>
        </div>
        </Link>
    );
}
export function Circle(){
    return <div className="h-1 w-1 rounded-full bg-slate-500"></div>
}
export function Avatar({name,size ="small"}:{name:string,size: "small"|"big"}){
    return <div className={`relative inline-flex items-center justify-center ${size ==="small"?"w-6 h-6":"w-10 h-10"} overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600`}>
    <span className={`font-thin text-gray-600 dark:text-gray-300 ${size==="small"?"text-xs":"text-md"}`}>{name[0]}</span>
    </div>
}