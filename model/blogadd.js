
const mongoose = require("mongoose");

const blogschema = new mongoose.Schema({
    title:{
        type: String,
        required: true,

    },
    body:{
        type: String,
        required: true,
    },
    coverimageurl:{
        type: String,
        required: false,
    },

    createdby:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    
    
} , {timestamps: true});


const blog = mongoose.model("blog" , blogschema);

module.exports = blog;
