import { User } from '../models/User.js';
import { ApiError } from '../utils/api-error.js';
import { createEditorSlug } from '../utils/slug.js';

export async function getMyEditor(userId: string) {
  const editor = await User.findOne({ _id: userId, role: 'editor' });
  if (!editor) throw new ApiError(404, 'EDITOR_NOT_FOUND', 'Editor not found.');
  return editor;
}

export async function updateMyEditor(userId: string, input: { editorName?: string; editorDescription?: string; editorAvatar?: string }) {
  const editor = await User.findOne({ _id: userId, role: 'editor' });
  if (!editor) throw new ApiError(404, 'EDITOR_NOT_FOUND', 'Editor not found.');

  if (input.editorName && input.editorName !== editor.editorName) {
    editor.editorSlug = await createEditorSlug(input.editorName, String(editor._id));
  }

  Object.assign(editor, input);
  await editor.save();
  return editor;
}
