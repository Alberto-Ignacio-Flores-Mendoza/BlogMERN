import express from "express"
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from './routes/auth.js'
import userRoute from './routes/users.js'
import postRoute from './routes/posts.js'
import commentRoute from './routes/comments.js'
import cors from "cors"
import cookieParser from "cookie-parser"
import multer from "multer"
import path from "path";
import helmet from "helmet";
import morgan from "morgan";
import { fileURLToPath } from "url";

const app= express()

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

//get our .env variables
dotenv.config();


//so we can access the req.body
app.use(express.json())
app.use(cookieParser())
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(cors({credentials:true}))


const storage = multer.diskStorage({
  destination:(req,file,fn)=>{
    fn(null, "images")
  },
  filename: (req,file,fn)=>{
    fn(null, req.body.img)
  }
})

//for image upload
const upload=multer({storage:storage})

app.post("/api/upload", upload.single("file"),(req,res)=>{
  res.status(200).json("Image has been uploaded successfully")
})

app.use("/images", express.static(path.join(__dirname, "images")))

// more middleware
app.use("/api/auth", authRoute)
app.use("/api/users", userRoute)
app.use("/api/posts", postRoute)
app.use("/api/comments", commentRoute)




const PORT= process.env.PORT || 3000

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

  })
  .catch((error) => console.log(`${error} did not connect`));