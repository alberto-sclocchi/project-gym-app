const {Schema, model} = require("mongoose");

const userSchema = new Schema ({
    username: {
        type: String, 
        unique: true, 
        required: true,
        trim: true,
        match: [/^[a-zA-Z0-9]{4,12}$/, "Numbers and letters only, must be between 4 and 12 characters"],
    },
    email: {
        type: String, 
        unique: true, 
        required: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."],
        lowercase: true
    },
    password: {
        type: String, 
        unique: true, 
        required: true 
    },
    regular: {
        type: Boolean
    },
    admin: {
        type: Boolean
    },
    banned: {
        type: Boolean
    },
    isTempPassword: {
        type: Boolean
    },
    image: {
        type: String,
        default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    }
},
{
    // this second object adds extra properties: `createdAt` and `updatedAt`    
    timestamps: true
});

module.exports = model ("User", userSchema);
