import { Auth } from "../components/Auth";
import YourImage from "../assets/images/Your paragraph text.png"; 

export const Signin = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div>
        <Auth type="signin" />
      </div>
      <div className="hidden lg:block">
        <img 
          src={YourImage} 
          alt="Your Paragraph Text" 
          className="w-full h-auto object-cover" 
        />
      </div>
    </div>
  );
};
