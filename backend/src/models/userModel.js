import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["CEO", "Manager", "TeamMember", "Intern"],
    default: "Intern",
  },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;
