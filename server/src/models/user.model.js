import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// userSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) {
//         next();
//     }

//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
// });

// userSchema.methods.comparePassword = async function (enteredPassword) {
//     return await bcrypt.compare(enteredPassword, this.password);
// };

const User = mongoose.model("User", userSchema);
export default User;