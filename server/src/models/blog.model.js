import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    slug: { type: String, required: true, unique: true},
    featuredImage: { type: String },
    status: { type: String,
        enum: ['draft', 'published', 'Active', 'Inactive'],
        default: 'draft',
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
},{
    timestamps: true,
});

export const Blog = mongoose.model("Blog", blogSchema);