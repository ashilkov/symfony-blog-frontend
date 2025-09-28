import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import CreateBlog from "./pages/CreateBlog";
import Blog from "./pages/Blog";
import Blogs from "./pages/Blogs";
import Posts from "./pages/Posts";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import About from "./pages/About";
import { MantineProvider } from "@mantine/core";
import EditPost from "./pages/EditPost";

// removed placeholder Posts component in favor of page
const Contact = () => <div>Contact</div>;

function App() {
  return (
    <MantineProvider>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Posts />} />
            <Route path="/post/:postId" element={<Post />} />
            <Route path="/post/:postId/edit" element={<EditPost />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/blog/:blogId" element={<Blog />} />
            <Route path="/posts/new" element={<CreatePost />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/account" element={<Account />} />
            <Route path="/blogs/new" element={<CreateBlog />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </MantineProvider>
  );
}

export default App;
