import { User } from '../models/User.js';
import { ApiError } from '../utils/api-error.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { signAccessToken } from '../utils/jwt.js';

function publicUser(user: any) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    isBlocked: user.isBlocked,
    editorName: user.editorName,
    editorSlug: user.editorSlug,
    editorDescription: user.editorDescription,
    editorAvatar: user.editorAvatar,
    mustChangePassword: user.mustChangePassword,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

export async function register(input: { name: string; email: string; password: string }) {
  const email = input.email.toLowerCase();
  if (await User.exists({ email })) throw new ApiError(409, 'EMAIL_ALREADY_EXISTS', 'A user with this email already exists.');
  const user = await User.create({ name: input.name, email, passwordHash: await hashPassword(input.password), role: 'user' });
  const token = signAccessToken({ sub: String(user._id), role: user.role });
  return { user: publicUser(user), token };
}

export async function login(input: { email: string; password: string }) {
  const user = await User.findOne({ email: input.email.toLowerCase() }).select('+passwordHash');
  if (!user || !(await comparePassword(input.password, user.passwordHash))) {
    throw new ApiError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect.');
  }
  const token = signAccessToken({ sub: String(user._id), role: user.role });
  return { user: publicUser(user), token };
}
