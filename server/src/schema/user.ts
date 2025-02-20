import mongoose, { Schema, Document, ObjectId } from 'mongoose';

// Interface TypeScript pour User
export interface IUser extends Document {
  _id: ObjectId;  // MongoDB génère un _id automatiquement
  username: string;
  email: string;
  password: string;
  createdAt: Date;
}

// Définition du schéma User
const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Export du modèle User
export const User = mongoose.model<IUser>('User', userSchema);
