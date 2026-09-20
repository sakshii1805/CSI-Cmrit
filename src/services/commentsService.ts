import { supabase } from '../lib/supabaseClient';
import { CommentItem, PublicComment, BlockedEmail, CommentTargetType } from '../types';

export const commentsService = {
  /**
   * Public: Fetch approved comments for a specific target item from the public_comments view
   */
  async getApprovedComments(targetType: CommentTargetType, targetId: string): Promise<{ data: PublicComment[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('public_comments')
        .select('*')
        .eq('target_type', targetType)
        .eq('target_id', targetId)
        .order('created_at', { ascending: false });

      if (error) return { data: [], error: error.message };
      return { data: (data || []) as PublicComment[] };
    } catch (err: unknown) {
      const error = err as Error;
      return { data: [], error: error.message };
    }
  },

  /**
   * Public: Submit a comment (stored with status = 'pending')
   */
  async submitComment(data: {
    targetType: CommentTargetType;
    targetId: string;
    authorName: string;
    authorEmail: string;
    content: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const payload = {
        target_type: data.targetType,
        target_id: data.targetId,
        author_name: data.authorName.trim(),
        author_email: data.authorEmail.trim().toLowerCase(),
        content: data.content.trim(),
        status: 'pending',
      };

      const { error } = await supabase
        .from('comments')
        .insert([payload]);

      if (error) {
        if (error.message.toLowerCase().includes('violates row-level security policy')) {
          return { success: false, error: 'Unable to submit comment. This email address has been flagged or blocked.' };
        }
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      return { success: false, error: error.message };
    }
  },

  /**
   * Admin: List all comments (pending, approved, rejected)
   */
  async adminListComments(): Promise<{ data: CommentItem[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return { data: [], error: error.message };
      return { data: (data || []) as CommentItem[] };
    } catch (err: unknown) {
      const error = err as Error;
      return { data: [], error: error.message };
    }
  },

  /**
   * Admin: Update comment status ('approved' | 'rejected' | 'pending')
   */
  async updateCommentStatus(id: string, status: 'approved' | 'rejected' | 'pending'): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ status })
        .eq('id', id);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      return { success: false, error: error.message };
    }
  },

  /**
   * Admin: Delete comment
   */
  async deleteComment(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      return { success: false, error: error.message };
    }
  },

  /**
   * Admin: Block an email and reject all their pending comments
   */
  async blockEmail(email: string, reason?: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: userData } = await supabase.auth.getUser();

      // 1. Insert into blocked_emails
      const { error: blockError } = await supabase
        .from('blocked_emails')
        .insert([{
          email: email.trim().toLowerCase(),
          reason: reason || 'Blocked by administrator',
          blocked_by: userData?.user?.id || null,
        }]);

      if (blockError && !blockError.message.toLowerCase().includes('unique constraint')) {
        return { success: false, error: blockError.message };
      }

      // 2. Reject all pending comments from this author_email
      await supabase
        .from('comments')
        .update({ status: 'rejected' })
        .eq('author_email', email.trim().toLowerCase())
        .eq('status', 'pending');

      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      return { success: false, error: error.message };
    }
  },

  /**
   * Admin: List blocked emails
   */
  async getBlockedEmails(): Promise<{ data: BlockedEmail[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('blocked_emails')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return { data: [], error: error.message };
      return { data: (data || []) as BlockedEmail[] };
    } catch (err: unknown) {
      const error = err as Error;
      return { data: [], error: error.message };
    }
  },

  /**
   * Admin: Unblock an email
   */
  async unblockEmail(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('blocked_emails')
        .delete()
        .eq('id', id);

      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      return { success: false, error: error.message };
    }
  }
};
