import { Button } from "./button";
import { BookOpen, Sparkles, Quote } from "lucide-react";
import YourImage from "../assets/images/Your paragraph text.png";
import { Link } from "react-router-dom";
const Hero = () => {
  return (
    <section className="bg-white py-20 lg:py-32 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 border border-black rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 border border-black rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-black rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-black rounded-full animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {/* Decorative quote element */}
            <div className="flex items-center space-x-2 mb-6">
              <Quote className="h-6 w-6 text-gray-400" />
              <span className="text-sm text-gray-500 italic">Where creativity meets community</span>
            </div>
            
            <div className="space-y-4 relative">
              {/* Decorative line */}
              <div className="absolute -left-6 top-0 w-1 h-full bg-gradient-to-b from-black to-gray-300"></div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-black leading-tight animate-fade-in">
                Where great
                <span className="text-gray-600 relative">
                  {" "}stories
                  <Sparkles className="inline-block h-6 w-6 ml-2 text-gray-400 animate-pulse" />
                </span>
                <br />
                come to life
              </h1>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4"><Link to = "./blogs">
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-6 border-black text-black hover:bg-black hover:text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
               <BookOpen className="h-5 w-5 mr-2" />
                Start Reading 
              </Button>
              </Link>
            </div>

            {/* Decorative elements */}
            <div className="flex items-center space-x-4 mt-8">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className="w-2 h-2 bg-black rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="relative">
            {/* Enhanced image container with multiple decorative layers */}
            <div className="relative">
              {/* Main image container */}
              <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-all duration-500 relative overflow-hidden">
                {/* Decorative corner elements */}
                <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-black"></div>
                <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-black"></div>
                <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-black"></div>
                <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-black"></div>
                
                <img 
                  src={YourImage} 
                  alt="Creative blogging illustration" 
                  className="w-full h-auto rounded-lg transform transition-transform duration-300 hover:scale-105"
                />
              </div>
              
              {/* Floating decorative elements */}
              <div className="absolute -top-6 -right-6 bg-black text-white rounded-full p-3 animate-bounce shadow-lg">
                <BookOpen className="h-6 w-6" />
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-white border-2 border-black rounded-full p-4 animate-pulse shadow-lg">
                <Sparkles className="h-6 w-6 text-black" />
              </div>
              
              {/* Background decorative shapes */}
              <div className="absolute -z-10 top-10 right-10 w-20 h-20 border-2 border-gray-200 rounded-full animate-pulse"></div>
              <div className="absolute -z-10 bottom-10 left-10 w-16 h-16 bg-gray-100 rounded-lg transform rotate-45"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-black to-transparent"></div>
    </section>
  );
};

export default Hero;
