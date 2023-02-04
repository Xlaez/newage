import { AppRes } from "owl-factory";
import {Post} from "../models/post.model";

const createPost = async (data: any)=>{
    return Post.create(data)
};

const updatePost = async (id: string, data: any)=>{
    return Post.updateOne({_id: id}, data);
}

const deletePost = async (id: string)=>{
    return Post.deleteOne({ _id: id })
};

const getPost = async (id: string)=>{
    return Post.findById(id).populate('author', 'username image social about').lean();
};

export  {
    createPost,
    getPost,
    deletePost,
    updatePost
}
