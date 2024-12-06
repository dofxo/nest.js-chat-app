import mongoose, { Schema, Document, Model } from "mongoose";
import { hash, compare } from "bcrypt";

// Define an interface for the User document
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define an interface for the User model (static methods)
export interface IUserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}

// Create the user schema
const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
});

// Pre-save hook to hash the password before saving the user
userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Hash the password using bcrypt with 12 rounds of salt
    this.password = await hash(this.password, 12);
    next(); // Proceed to save the user
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
});

// Instance method to compare the hashed password with a plain password
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  try {
    // Compare the plain text password with the hashed password in the DB
    return await compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Password comparison failed.");
  }
};

// Create the user model with IUser and IUserModel interfaces
export const User = mongoose.model<IUser, IUserModel>("Users", userSchema);
