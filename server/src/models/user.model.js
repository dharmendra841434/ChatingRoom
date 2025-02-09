// models/meeting.model.ts
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { type } from "os";

// Define MongoDB schemas and models
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    full_name: { type: String, required: true },
    password: { type: String, required: true },
    profile_pic: { type: String, required: true },
    isActive: { type: Boolean, required: true },
    sendedRequests: {
      type: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, required: true },
        },
      ],
      default: [],
      _id: false,
    },
    recivedRequests: {
      type: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, required: true },
        },
      ],
      default: [],
      _id: false,
    },
    friends: {
      type: [
        {
          userId: { type: mongoose.Schema.Types.ObjectId, required: true },
          chatKey: { type: String, required: true },
        },
      ],
      default: [],
      _id: false,
    },
    profileIconColor: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateJWTToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      full_name: this.full_name,
    },
    process.env.JWTSECRET,
    {
      expiresIn: "7d",
    }
  );
};

const User = mongoose.model("User", UserSchema);

export default User;
