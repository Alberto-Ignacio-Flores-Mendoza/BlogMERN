import express from "express"
const router= express.Router()
import User from "../models/User.js"
import bcrypt from 'bcrypt'
import Post from "../models/Post.js"
import Comment from "../models/Comment.js"
import verifyToken from "../verifyToken.js"


//Crete a post

router.post("/create", verifyToken, async(req,res)=>{
    try {
        const newPost = new Post(req.body)
        const savedPost =await newPost.save()
        res.status(200).json(savedPost)
    } catch (error) {
        res.status(500).json(error)
        
    }
})

//update a post
router.put("/:id", verifyToken, async (req,res)=>{
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, {$set:req.body}, {new:true})
        res.status(200).json(updatedPost)
    } catch (error) {
        res.status(500).json(error)
    }
})

//Delete a post 
router.delete("/:id",verifyToken, async (req,res)=>{
    try {
        await Post.findByIdAndDelete(req.params.id)
        await Comment.deleteMany({postId: req.params.id})
        res.status(200).json("Post has been deleted")
    } catch (error) {
        res.status(500).json(error)
    }
})

//GET POST DETAILS
router.get("/:id",async (req,res)=>{
    try{
        const post=await Post.findById(req.params.id)
        res.status(200).json(post)
    }
    catch(err){
        res.status(500).json(err)
    }
})

//Get a post
router.get("/",async (req,res)=>{
    const query=req.query
    
    try{
        const searchFilter={
            //regex, regular expresion, used for search querys
            title:{$regex: query.search, $options:"i"}
        }
        
        //does query exist? if so search for posts that contain that query
        //if not return all posts
        const posts=await Post.find(query.search?searchFilter:null)
        res.status(200).json(posts)
    }
    catch(err){
        res.status(500).json(err)
    }
})

//Get a users posts
router.get("/user/:userId",async (req,res)=>{
    try{
        const posts=await Post.find({userId:req.params.userId})
        res.status(200).json(posts)
    }
    catch(err){
        res.status(500).json(err)
    }
})

export default router