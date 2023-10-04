import express from "express"
const router= express.Router()
import User from "../models/User.js"
import bcrypt from 'bcrypt'
import Post from "../models/Post.js"
import Comment from "../models/Comment.js"
import verifyToken from "../verifyToken.js"


//CREATE
router.post("/create", verifyToken , async (req,res)=>{
    try{
        const newComment=new Comment(req.body)
        console.log(`This is the body ${req.body}`)
        const savedComment=await newComment.save()
        console.log("2")

        res.status(200).json(savedComment)
    }
    catch(err){
        res.status(500).json(err)
    }
    
})

//UPDATE
router.put("/:id", verifyToken, async (req,res)=>{
    try{
       
        const updatedComment=await Comment.findByIdAndUpdate(req.params.id,{$set:req.body},{new:true})
        res.status(200).json(updatedComment)

    }
    catch(err){
        res.status(500).json(err)
    }
})


//DELETE
router.delete("/:id", verifyToken, async (req,res)=>{
    try{
        const comment = await Comment.findByIdAndDelete(req.params.id)
        
        res.status(200).json(comment)

    }
    catch(err){
        res.status(500).json(err)
    }
})




//GET POST COMMENTS
router.get("/post/:postId",async (req,res)=>{
    try{
        const comments=await Comment.find({postId:req.params.postId})
        res.status(200).json(comments)
    }
    catch(err){
        res.status(500).json(err)
    }
})


export default router