import React, { useEffect, useState } from "react";
import appwriteService from "../services/config";
import { useSelector } from "react-redux";
import { Container, PostCard } from "../components";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();
    const authStatus = useSelector((state) => state.auth.status);

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        if (authStatus) {
            appwriteService.getPosts().then((posts) => {
                if (posts) setPosts(posts);
            });
        }
    }, []);

    if (!authStatus) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                Login to read posts
                            </h1>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="flex flex-wrap">
                        <div className="p-2 w-full">
                            <h1 className="text-2xl font-bold hover:text-gray-500">
                                There is no posts
                            </h1>
                            <p className="my-8">Add new post to showcase your skills</p>
                            <button onClick={() => navigate("/add-post")} className="inline-bock px-6 py-2 font-medium duration-200 bg-blue-100 rounded-full cursor-pointer">
                                Add Post
                            </button>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className="w-full py-8">
            <Container>
                <div className="flex flex-wrap">
                    {posts.map((post) => (
                        <div key={post._id} className="p-2 w-1/4">
                            <PostCard {...post} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    );
}

export default Home;