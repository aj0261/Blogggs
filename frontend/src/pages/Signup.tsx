import YourImage from "../assets/images/Your paragraph text.png";
import { Auth } from "../components/Auth";
export const Signup = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2">
      <div>
        <Auth type="signup"/>
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
