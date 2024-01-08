const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let commentsSchema = new Schema(
    {
        postId: {
            type: String,
        },
        comment: {
            type: String,
        },
        userId: {
            type: String,
        }
    },
    { timestamps: true }
);

let Comments = mongoose.model("comments", commentsSchema);

module.exports = Comments;