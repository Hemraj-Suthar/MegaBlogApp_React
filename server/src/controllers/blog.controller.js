import { Blog } from "../models/blog.model.js";
import uploadOnCloudinary from '../utils/cloudinary.js';

const createBlog = async (req, res) => {
    const { title, content, slug, status } = req.body;
    const userId = req.userId; // Get userId from the authenticated user

    if (!title || !content || !slug || !status) {
        return res.status(400).json({
            success: false,
            message: 'Title, content, slug, and status are required.',
        });
    }
    
    const uploadedFile = await uploadOnCloudinary(req.file);

    try {
        const existingBlog = await Blog.findOne({ slug });
        if (existingBlog) {
            return res.status(400).json({
                success: false,
                message: 'A blog with the same slug already exists.',
            });
        }

        const newBlog = new Blog({
            title,
            content,
            slug,
            featuredImage: uploadedFile.url,
            status: status || 'draft',
            userId
        });

        await newBlog.save();

        res.status(201).json({
            success: true,
            message: 'Blog created successfully.',
            data: newBlog,
        });
    } catch (error) {
        console.error('Create blog error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to create the blog. Please try again later.',
            error: error.message,
        });
    }
};

const getAllBlogs = async (req, res) => {
    const userId = req.userId;
    
    try {
        const blogs = await Blog.find({ userId });

        if (blogs.length === 0) {
            return res.status(404).json({
              success: false,
              message: 'No blogs found.',
            });
        }

        res.json({
            success: true,
            data: blogs,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch the blogs. Please try again later.',
            error: error.message,
        });
    }
};

const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found.',
            })
        }
        
        res.json({
            success: true,
            data: blog,
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch the blog. Please try again later.',
            error: error.message,
        });
    }
};

const editBlog = async (req, res) => {
    const blogId = req.params.id;
    const { title, content, slug, status } = req.body;

    if (!title || !content || !slug || !status) {
        return res.status(400).json({
            success: false,
            message: 'Title, content, and slug are required.',
        })
    }
    
    const uploadedFile = await uploadOnCloudinary(req.file);

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            blogId,
            {
                title,
                content,
                slug,
                featuredImage: uploadedFile.url || '',
                status: status || 'draft',
            },
            { new: true }
        );

        if(!updatedBlog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found.',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Blog updated successfully.',
            data: updatedBlog,
        })
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update the blog. Please try again later.',
            error: error.message,
        });
    }
};

const deleteBlog = async (req, res) => {
    const blogId = req.params.id;
    
    try {
        const deleteBlog = await Blog.findOneAndDelete({_id: blogId});

        if (!deleteBlog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found.',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Blog deleted successfully.',
            data: deleteBlog,
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Failed to delete the blog. Please try again later.',
            error: error.message,
        });
    }

};

export { createBlog, getAllBlogs, getBlogById, editBlog, deleteBlog };