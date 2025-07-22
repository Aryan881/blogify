const mongoose = require("mongoose");
const {createHmac, randomBytes} = require("node:crypto");
const { createtokenforuser } = require("../service/authentication");

const userschema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    salt: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    profileimg: {
        type: String,
        default: "/images/default.png",
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    },
}, {timestamps: true});

userschema.pre("save", function(next) {
    const user = this;
    if (!user.isModified("password")) {
        return next();
    }
    const salt = randomBytes(16).toString();
    const hashedpassword = createHmac("sha256", salt).update(user.password).digest("hex");

    this.salt = salt;
    this.password = hashedpassword;
    next();
});

// Static method to match password
userschema.static('matchPasswordandcreatetokenforusers', async function(email, password) {
    const user = await this.findOne({ email });
    if (!user) {
        throw new Error("User not found");
    }

    const salt = user.salt;
    const hashedPassword = user.password;
    
    const userProvidedHash = createHmac("sha256", salt)
        .update(password)
        .digest("hex");

    if (hashedPassword !== userProvidedHash) {
        throw new Error("Incorrect password");
    }
       
    // return{ ...user , password: undefined , salt: undefined};
    const token = createtokenforuser(user);
   return token;
});

const user = mongoose.model("user", userschema);

module.exports = user;  

