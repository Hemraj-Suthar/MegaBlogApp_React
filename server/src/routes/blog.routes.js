import Router from "express";
import { createBlog, getAllBlogs, getBlogById, editBlog, deleteBlog} from "../controllers/blog.controller.js";
import upload from "../middleware/uploadMiddleware.js";
import verifyToken from "../middleware/verifyToken.js";

const blogRoute = new Router();

blogRoute.post('/create-blog', verifyToken, upload.single('featuredImage'), createBlog)
blogRoute.get('/blogs', verifyToken, getAllBlogs)
blogRoute.get('/blog/:id', getBlogById)
blogRoute.put('/edit-blog/:id', upload.single('featuredImage'), editBlog)
blogRoute.delete('/delete/:id', deleteBlog)

export default blogRoute;