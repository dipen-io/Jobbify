const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is requried"],
        trim: true,
        maxLength: [50, "Name cannot exceeded 50 character"],
    },

    email: {
        type: String,
        required: [true, 'Email is Required'],
        unique: true,
        trim: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: [true, 'Password is Required'],
        minLength: [6, "Password must be at least 6 character"],
        select: false // never return in query
    },

    role: {
        type: String,
        enum: ["recruiter", "applicant"],
        default: "applicant"
    },
    resume: {
        type: String,
        default: null
    },
    refreshToken: {
        type: String,
        select: false
    },
}, {timestamps: true}
)

// hash the password 
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

//Compare the password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};


module.exports = mongoose.model("User", userSchema);
