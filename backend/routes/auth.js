import express from 'express'
const router= express.Router()
import User from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import verifyToken from '../verifyToken.js'


//Resgister new user
router.post("/register", async (req,res)=>{
    try {
        const {username, email, password}= req.body;

        //encrypt password
        const salt= await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hashSync(password,salt)

        //pass the new encrypted password
        const newUser = new User({username,email,password:hashedPassword})
        const savedUser = await newUser.save()
        res.status(200).json(savedUser)


    } catch (error) {
        if(error.code === 11000) return res.status(400).send('Email already exists')
        res.status(500).send(error.message)
    }
})


//Login

router.post("/login",async (req,res)=>{
    try{
        const user=await User.findOne({email:req.body.email})
       
        if(!user){
            return res.status(404).json("User not found!")
        }
        const match=await bcrypt.compare(req.body.password,user.password)
        
        if(!match){
            return res.status(401).json("Wrong credentials!")
        }
        const token=jwt.sign({_id:user._id,username:user.username,email:user.email},process.env.SECRET,{expiresIn:"3d"})
        const {password,...info}=user._doc
        res.status(200).json({ token, user });

       // res.cookie("token",token).status(200).json(info)

    }
    catch(error){
        res.status(500).json(error)
    }
})

//Logout
router.get("/logout",async (req,res)=>{
    try {
        res.clearCookie("token", {sameSite:"none", secure:true}).status(200).send("user logged out successfully")
    } catch (error) {
        res.status(500).json(error)
    }
})

 router.get("/refetch",(req,res)=>{
    //const token= req.cookies.token
    try{
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimStart();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;

        res.status(200).json(data)
    }
    catch(error){
            res.status(500).json({ error: error.message });

    }
    
}) 

export default router