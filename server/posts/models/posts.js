const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let postSchema = new Schema(
    {
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        userId: {
            type: String,
        },
        commentId: {
            type: Array,
        },
    },
    { timestamps: true }
);

let Post = mongoose.model("posts", postSchema);

module.exports = Post;