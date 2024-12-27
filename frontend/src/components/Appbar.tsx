import { Link } from "react-router-dom";
import { Avatar } from "./BlogCard";
import YourImage from "../assets/images/blogggs.png";
import { jwtDecode, JwtPayload } from 'jwt-decode';
interface CustomJwtPayload extends JwtPayload {
    name?: string;
}
export const Appbar = () => {
    const jwtToken = localStorage.getItem("token");
    const decoded = jwtToken ? jwtDecode<CustomJwtPayload>(jwtToken) : null;
  return (
    <div className="border-b flex justify-between items-center px-10 py-4 bg-white">
      <Link to={'/blogs'} className="flex flex-col justify-center cursor-pointer">
        <img
          src={YourImage}
          alt="Blogggs Logo"
          className="h-10 w-auto object-contain"
        />
      </Link>
      <div className="flex items-center">
        <Link to={'/publish'}>
          <button
            type="button"
            className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center"
          >
            New
          </button>
        </Link>
        {decoded && <Avatar name={decoded.name || "Guest"} size="big" />}
      </div>
    </div>
  );
};
