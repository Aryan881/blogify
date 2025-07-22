const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    blogid:{
   type: mongoose.Schema.Types.ObjectId,
        ref: "blog"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        
    }
}, { timestamps: true });


const comments = mongoose.model("comments" , commentSchema );

module.exports = comments