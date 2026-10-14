import crypto from 'node:crypto';
import { User } from '../models/User.js';
import { News } from '../models/News.js';
import { ApiError } from '../utils/api-error.js';
import { hashPassword } from '../utils/password.js';
import { createEditorSlug } from '../utils/slug.js';
import { cleanupNewsMedia } from './media.service.js';

function temporaryPassword(): string {
  return crypto.randomBytes(9).toString('base64url');
}

export async function createEditor(input: { name: string; email: string; editorName: string; editorDescription?: string; editorAvatar?: string }) {
  const email = input.email.toLowerCase();
  if (await User.exists({ email })) throw new ApiError(409, 'EMAIL_ALREADY_EXISTS', 'A user with this email already exists.');

  const tempPassword = temporaryPassword();
  const editorName = input.editorName;
  const user = await User.create({
    name: input.name,
    email,
    passwordHash: await hashPassword(tempPassword),
    role: 'editor',
    mustChangePassword: true,
    isBlocked: false,
    editorName,
    editorSlug: await createEditorSlug(editorName),
    editorDescription: input.editorDescription,
    editorAvatar: input.editorAvatar
  });

  return {
    editor: user,
    temporaryPassword: tempPassword
  };
}

export async function listEditors() {
  return User.find({ role: 'editor' }).select('-passwordHash').sort({ createdAt: -1 }).lean();
}

export async function setEditorBlocked(id: string, isBlocked: boolean) {
  const editor = await User.findOneAndUpdate(
    { _id: id, role: 'editor' },
    { $set: { isBlocked } },
    { new: true, runValidators: true }
  );
  if (!editor) throw new ApiError(404, 'EDITOR_NOT_FOUND', 'Editor not found.');
  return editor;
}

export async function deleteEditor(id: string) {
  const user = await User.findOne({ _id: id, role: 'editor' });
  if (!user) throw new ApiError(404, 'EDITOR_NOT_FOUND', 'Editor not found.');

  const drafts = await News.find({ editor: id, status: 'draft' }).select('medias').lean();
  await News.deleteMany({ editor: id, status: 'draft' });
  await News.updateMany({ editor: id }, { $unset: { editor: 1 } });
  for (const draft of drafts) await cleanupNewsMedia(draft.medias.map(media => media.url));
  await User.deleteOne({ _id: id });
}
