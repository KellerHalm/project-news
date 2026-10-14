import { Schema, model, type HydratedDocument } from 'mongoose';

export type UserRole = 'user' | 'editor' | 'admin';

export interface UserDocument {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  avatar?: string;
  mustChangePassword: boolean;
  isBlocked: boolean;
  editorName?: string;
  editorSlug?: string;
  editorDescription?: string;
  editorAvatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['user', 'editor', 'admin'], default: 'user', index: true },
    avatar: { type: String, trim: true },
    mustChangePassword: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false, index: true },
    editorName: { type: String, trim: true, minlength: 2, maxlength: 120 },
    editorSlug: { type: String, trim: true, unique: true, sparse: true, index: true },
    editorDescription: { type: String, trim: true, maxlength: 1000 },
    editorAvatar: { type: String, trim: true }
  },
  { timestamps: true }
);

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete (ret as Partial<UserDocument>).passwordHash;
    return ret;
  }
});

export const User = model<UserDocument>('User', userSchema);
export type UserHydrated = HydratedDocument<UserDocument>;
