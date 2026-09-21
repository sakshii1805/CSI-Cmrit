import { supabase } from '../lib/supabaseClient';

export type StorageBucket = 'event-images' | 'highlights' | 'announcements' | 'gallery';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf' // only allowed for announcements attachments
];

export const storageService = {
  /**
   * Upload an image/file to Supabase Storage and return its public URL
   */
  async uploadFile(bucket: StorageBucket, file: File): Promise<{ url?: string; error?: string }> {
    try {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return { error: 'File size exceeds maximum limit of 5 MB.' };
      }

      // Validate MIME type
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return { error: 'Unsupported file type. Please upload a JPEG, PNG, or WebP image.' };
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const cleanName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[^a-zA-Z0-9_-]/g, '_')
        .toLowerCase();
      const fileName = `${Date.now()}_${cleanName}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        return { error: uploadError.message };
      }

      // Retrieve public URL
      const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
      return { url: data.publicUrl };
    } catch (err: unknown) {
      const error = err as Error;
      return { error: error.message || 'Failed to upload file to storage.' };
    }
  },

  /**
   * Delete a file from a storage bucket by URL
   */
  async deleteFileByUrl(bucket: StorageBucket, fileUrl: string): Promise<boolean> {
    try {
      if (!fileUrl) return false;
      const parts = fileUrl.split(`${bucket}/`);
      if (parts.length < 2) return false;
      const filePath = parts[1];

      const { error } = await supabase.storage.from(bucket).remove([filePath]);
      if (error) {
        console.warn(`[Storage] Failed to delete file ${filePath}:`, error.message);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }
};
