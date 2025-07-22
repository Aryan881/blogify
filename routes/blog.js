const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Blog = require("../model/blogadd");
const comment = require("../model/commentsmodel");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./images/uploads`));
    },
    filename: function (req, file, cb) {
     const filename = `${Date.now()}-${file.originalname}`;
      cb(null, filename);   
    }
});

const upload = multer({ storage: storage });

router.get("/blogaddnew", (req, res) => {
    return res.render("blogaddnew", {
        user: req.user
    });
});

router.post("/", upload.single("coverImage") , async(req, res) => {
   console.log(req.body);
   console.log(req.file);
   const {title, content} = req.body;
   const newBlog = await Blog.create({
    title,
    body: content,
    createdby: req.user.id,
    coverimageurl: `/uploads/${req.file.filename}`
   });
   console.log(newBlog);

   return res.redirect("/");
});

router.get("/:id" , async (req , res)=>{
    try {
        const blog = await Blog.findById(req.params.id).populate('createdby');
        
        if (!blog) {
            return res.status(404).render("error", {
                user: req.user,
                error: "Blog post not found"
            });
        }

        return res.render("showblog" , {
            user: req.user,
            blog,
            
        });
    } catch (error) {
        return res.status(400).render("error", {
            user: req.user,
            error: "Invalid blog ID format"
        });
    }
});

router.post("/comments/:id" , async(req , res)=>{
    try {
        const newComment = await comment.create({
            content: req.body.content,
            blogid: req.params.id,
            createdby: req.user._id
        });
        
        console.log(newComment);
        return res.redirect(`/blog/${req.params.id}`);
    } catch (error) {
        console.error("Error creating comment:", error);
        return res.status(500).render("error", {
            user: req.user,
            error: "Failed to create comment"
        });
    }
});

module.exports = router;    