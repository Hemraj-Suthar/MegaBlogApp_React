import conf from '../conf/conf.js';

export class Service{
    
    constructor(){
        this.baseUrl = import.meta.env.VITE_BASE_URL
    }

    async createPost({title, slug, content, featuredImage, status}){
        const formData = new FormData();
        formData.append('title', title);
        formData.append('slug', slug);
        formData.append('content', content);
        formData.append('status', status);

        if (featuredImage) {
            formData.append('featuredImage', featuredImage);
        }

        try {
            const response = await fetch(`${this.baseUrl}/blog/create-blog`, {
                method: "POST",
                body: formData,
            })

            const data = await response.json();
            return {title, slug, content, featuredImage, status} = data;
        } catch (error) {
            console.log("Error in createPost ::", error);
        }
    }

    async updatePost({title, slug, content, featuredImage, status, id}){
        console.log(featuredImage);
        
        const formData = new FormData();
        formData.append('title', title);
        formData.append('slug', slug);
        formData.append('content', content);
        formData.append('status', status);

        if (featuredImage) {
            formData.append('featuredImage', featuredImage);
        }

        try {
            const response = await fetch(`${this.baseUrl}/blog/edit-blog/${id}`, {
                method: "PUT",
                body: formData,
            })

            const data = await response.json();
            return {title, slug, content, featuredImage, status} = data;
        } catch (error) {
            console.log("Appwrite serive :: updatePost :: error", error);
        }
    }

    async deletePost(id) {
        try {
            const response = await fetch(`${this.baseUrl}/blog/delete/${id}`, {
                method: "DELETE"
            })

            const data = await response.json();
            return true
        } catch (error) {
            console.log("deletePost :: error", error);
            return false
        }
    }

    async getPost(id){
        try {
            const response = await fetch(`${this.baseUrl}/blog/blog/${id}`)

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.log("getPost :: error", error);
            return false
        }
    }

    async getPosts(){
        try {
            const response = await fetch(`${this.baseUrl}/blog/blogs`)

            const data = await response.json();
            return data.data;
        } catch (error) {
            console.log("getPosts :: error", error);
            return false
        }
    }
}


const service = new Service()
export default service