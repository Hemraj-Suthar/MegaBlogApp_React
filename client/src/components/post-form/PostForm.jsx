import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "../index";
import appwriteService from "../../services/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            id: post?._id || "",
            title: post?.title || "",
            slug: post?.slug || "",
            content: post?.content || "",
            status: post?.status || "Active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    

    const submit = async (data) => {
        
        // data.featuredImage will be a FileList from react-hook-form.
        // We need to extract the actual File object from it.
        const imageFile = data.featuredImage && data.featuredImage[0] ? data.featuredImage[0] : null;
        
        // Create a new object for appwriteService.createPost, excluding the FileList
        // and including the actual File object under the 'featuredImage' key.
        const { featuredImage, ...otherData } = data; // Destructure to separate the FileList

        if (post) {
            
            const dbPost = await appwriteService.updatePost({
                ...otherData,
                featuredImage: imageFile, // <--- This sends the actual File object
            });
            if (dbPost) {
                navigate(`/post/${dbPost._id}`);
            }
        } else {
            const dbPost = await appwriteService.createPost({
                ...otherData, // This sends title, slug, content, status, etc.
                featuredImage: imageFile,
            });
            if (dbPost) {
                navigate(`/post/${dbPost._id}`);
            }
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {
                        setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                    }}
                />
                <RTE label="Content :" name="content" control={control} defaultValue={getValues("content")} />
            </div>
            <div className="w-1/3 px-2">
                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("featuredImage", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={`${post.featuredImage}`}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <Select
                    options={["Active", "Inactive"]}
                    label="Status :"
                    className="mb-4"
                    {...register("status", { required: false })}
                />
                <Button type="submit" bgColor={post ? "bg-green-500" : undefined} className="w-full">
                    {post ? "Update" : "Submit"}
                </Button>
            </div>
        </form>
    );
}
