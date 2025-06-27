import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Signup } from './pages/Signup';
import { Signin } from './pages/Signin';
import { Blog } from './pages/Blog';
import { Blogs } from './pages/Blogs'; 
import { Publish } from './pages/Publish';
import { MyBlogsPage } from "./pages/MyBlogsPage";
import { SearchPage } from "./pages/SearchPage";   
import { UserProfilePage } from './pages/UserProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { Landing } from './pages/Landing';
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/blog/:id" element={<Blog />} />
          <Route path="/blogs" element = {<Blogs/>}/>
          <Route path ="/publish" element = {<Publish/>}/>
          <Route path="/my-blogs" element={<MyBlogsPage />} />
          <Route path="/edit/:blogId" element={<Publish />} /> 
          <Route path="/search" element={<SearchPage />} />
          <Route path="/author/:id" element={<UserProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
