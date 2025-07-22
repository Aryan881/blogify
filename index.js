const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const userroute = require("./routes/user");
const mongoose = require("mongoose");
const cookieparser = require("cookie-parser");
const { checkforauthentcationcookie } = require("./middlewares/authentication");
const blogroute = require("./routes/blog"); 
const blog = require("./model/blogadd");

mongoose.connect("mongodb://localhost:27017/blogifyusers")
.then(()=>{
  console.log("mongodb connected sucessfully");
})
.catch((err)=>{
  console.log(err);
})

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieparser());
app.use(checkforauthentcationcookie("token"));
app.use(express.static(path.resolve("./public")));
app.use(express.static(path.resolve("./images")));


app.get("/", async(req, res) => {
  const allblogs = await blog.find({}).sort({ createdAt: -1 });
  res.render("home" , {
    user:req.user,
    blogs:allblogs,
  });
});

app.get("/showblog/:id", async(req, res) => {
  try {
    const blog = await blog.findById(req.params.id).populate('createdby');
    
    if (!blog) {
      return res.status(404).render("error", {
        user: req.user,
        error: "Blog post not found"
      });
    }

    return res.render("showblog", {
      user: req.user,
      blog
    });
  } catch (error) {
    return res.status(400).render("error", {
      user: req.user,
      error: "Invalid blog ID format"
    });
  }
});

app.use("/blog", blogroute);
app.use("/user", userroute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
