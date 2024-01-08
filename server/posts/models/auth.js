const mongoose = require("mongoose");
let Schema = mongoose.Schema;

const bcrypt = require('bcryptjs');

let authSchema = new Schema(
    {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
        },
        password: {
            type: String,
        },
    },
    { timestamps: true }
);

authSchema.pre('save', function (next) {
    let user = this;
    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err);

        // hash the password using new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            // save password as hash
            user.password = hash;
            next();
        });
    });
});

let Auth = mongoose.model("users", authSchema);

module.exports = Auth;