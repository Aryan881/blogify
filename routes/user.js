const express = require("express");
const User = require("../model/user");

const router = express.Router();

router.get("/signin", (req, res) => {
       return res.render("signin");
});

router.get("/signup", (req, res) => {
    return res.render("signup");
});

router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const authenticatedUser = await User.matchPasswordandcreatetokenforusers(email, password);
        console.log("User authenticated:", authenticatedUser);
        return res.cookie("token" ,authenticatedUser).redirect("/");
    } catch (error) {
        console.error("Signin error:", error.message);
        return res.status(400).render("signin", {
            error: error.message
        });
    }
});

router.post("/signup", async(req, res) => {
    try {
        const {fullname, email, password} = req.body;
        await User.create({
            fullname,
            email,
            password,
          });
          return res.redirect("/");
    } catch (error) {
        console.error("Signup error:", error.message);
        return res.status(400).render("signup", {
            error: error.message
        });
    }
});

router.get("/logout", (req, res) => {
    res.clearCookie("token");
    return res.redirect("/");
});

module.exports = router;