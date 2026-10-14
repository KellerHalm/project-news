import { User } from '../models/User.js';
import { SavedNews } from '../models/SavedNews.js';
import { News } from '../models/News.js';
import { ApiError } from '../utils/api-error.js';
import { comparePassword, hashPassword } from '../utils/password.js';
import { cleanupNewsMedia } from './media.service.js';

export async function getMe(userId: string) {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'USER_NOT_FOUND', 'User not found.');
  return user;
}

export async function updateMe(userId: string, input: { name?: string; avatar?: string }) {
  const user = await User.findByIdAndUpdate(userId, { $set: input }, { new: true, runValidators: true });
  if (!user) throw new ApiError(404, 'USER_NOT_FOUND', 'User not found.');
  return user;
}

export async function changePassword(userId: string, input: { currentPassword: string; newPassword: string }) {
  const user = await User.findById(userId).select('+passwordHash');
  if (!user) throw new ApiError(404, 'USER_NOT_FOUND', 'User not found.');
  if (!(await comparePassword(input.currentPassword, user.passwordHash))) {
    throw new ApiError(400, 'INVALID_CURRENT_PASSWORD', 'Current password is incorrect.');
  }
  user.passwordHash = await hashPassword(input.newPassword);
  user.mustChangePassword = false;
  await user.save();
}

export async function deleteMe(userId: string) {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'USER_NOT_FOUND', 'User not found.');
  if (user.role === 'admin') throw new ApiError(400, 'ADMIN_DELETE_NOT_ALLOWED', 'The admin account cannot be deleted through this endpoint.');

  await SavedNews.deleteMany({ user: userId });

  if (user.role === 'editor') {
    const drafts = await News.find({ editor: userId, status: 'draft' }).select('medias').lean();
    await News.deleteMany({ editor: userId, status: 'draft' });
    await News.updateMany({ editor: userId }, { $unset: { editor: 1 } });
    for (const draft of drafts) await cleanupNewsMedia(draft.medias.map(media => media.url));
  }

  await User.deleteOne({ _id: userId });
}
