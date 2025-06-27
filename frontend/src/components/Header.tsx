
import { Link } from "react-router-dom";
import { Button } from "./button";
import { BookOpen } from "lucide-react";
const Header = () => {
  return (
    <header className="border-b bg-white backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-black" />
          <span className="text-2xl font-bold text-black">BLOGGGS</span>
        </div>

        <div className="flex items-center space-x-4">
          <Link to = "/signin">
            <Button variant="ghost" className="text-black hover:bg-gray-100">
              Sign In
            </Button>
          </Link>
          <Link to = "/signup">
            <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
