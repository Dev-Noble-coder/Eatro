import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
type: String,
    }, 
    fullName: {
        type: String,
        required: true
    },
    hostel: {
        type: String,
    },
    roomNumber: {
        type: String,
    },

    phoneNumber: {
        type: String,
    }
})

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;