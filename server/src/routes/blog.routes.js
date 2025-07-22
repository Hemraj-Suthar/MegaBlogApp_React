import Router from "express";
import { createBlog, getAllBlogs, getBlogById, editBlog, deleteBlog} from "../controllers/blog.controller.js";
import upload from "../middleware/uploadMiddleware.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const blogRoute = new Router();

blogRoute.post('/create-blog', upload.single('featuredImage'), createBlog)
blogRoute.get('/blogs', getAllBlogs)
blogRoute.get('/blog/:id', getBlogById)
blogRoute.put('/edit-blog/:id', upload.single('featuredImage'), editBlog)
blogRoute.delete('/delete/:id', deleteBlog)

export default blogRoute;