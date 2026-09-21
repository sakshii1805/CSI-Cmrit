import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { CommentItem, PublicComment, BlockedEmail, CommentTargetType } from '../types';

const COMMENTS_STORAGE_KEY = 'csi_comments_data';
const BLOCKED_STORAGE_KEY = 'csi_blocked_emails_data';
const DELETED_COMMENTS_KEY = 'csi_deleted_comments';

const getDeletedCommentIds = (): Set<string> => {
  try {
    const raw = localStorage.getItem(DELETED_COMMENTS_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
};

const saveDeletedCommentId = (id: string) => {
  try {
    const set = getDeletedCommentIds();
    set.add(id);
    localStorage.setItem(DELETED_COMMENTS_KEY, JSON.stringify(Array.from(set)));
  } catch { }
};

const getStoredComments = (): CommentItem[] => {
  try {
    const raw = localStorage.getItem(COMMENTS_STORAGE_KEY);
    const parsed: CommentItem[] = raw ? JSON.parse(raw) : [];
    const deleted = getDeletedCommentIds();
    return parsed.filter(c => !deleted.has(c.id));
  } catch {
    return [];
  }
};

const saveStoredComments = (comments: CommentItem[]) => {
  try {
    const deleted = getDeletedCommentIds();
    const clean = comments.filter(c => !deleted.has(c.id));
    localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(clean));
    window.dispatchEvent(new CustomEvent('csi_content_updated', { detail: { type: 'comment' } }));
  } catch (err) {
    console.warn('Failed to save comments to localStorage:', err);
  }
};

const getStoredBlockedEmails = (): BlockedEmail[] => {
  try {
    const raw = localStorage.getItem(BLOCKED_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveStoredBlockedEmails = (emails: BlockedEmail[]) => {
  try {
    localStorage.setItem(BLOCKED_STORAGE_KEY, JSON.stringify(emails));
  } catch (err) {
    console.warn('Failed to save blocked emails:', err);
  }
};

export const commentsService = {
  /**
   * Public: Fetch approved comments for a specific target item
   */
  async getApprovedComments(targetType: CommentTargetType, targetId: string): Promise<{ data: PublicComment[]; error?: string }> {
    try {
      const local = getStoredComments()
        .filter(c => c.target_type === targetType && c.target_id === targetId && c.status === 'approved')
        .map(c => ({
          id: c.id,
          target_type: c.target_type,
          target_id: c.target_id,
          author_name: c.author_name,
          content: c.content,
          created_at: c.created_at
        }));

      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('public_comments')
            .select('*')
            .eq('target_type', targetType)
            .eq('target_id', targetId)
            .order('created_at', { ascending: false });

          if (!error && data && data.length > 0) {
            const deleted = getDeletedCommentIds();
            const remote = (data as PublicComment[]).filter(c => !deleted.has(c.id));
            const ids = new Set(remote.map(r => r.id));
            const localOnly = local.filter(l => !ids.has(l.id));
            return { data: [...localOnly, ...remote] };
          }
        } catch { }
      }

      return { data: local };
    } catch (err: unknown) {
      const error = err as Error;
      return { data: [], error: error.message };
    }
  },

  /**
   * Public: Submit a comment (stored with status = 'pending' until admin approves)
   */
  async submitComment(data: {
    targetType: CommentTargetType;
    targetId: string;
    authorName: string;
    authorEmail: string;
    content: string;
  }): Promise<{ success: boolean; error?: string }> {
    try {
      const email = data.authorEmail.trim().toLowerCase();
      const blocked = getStoredBlockedEmails();
      if (blocked.some(b => b.email.toLowerCase() === email)) {
        return { success: false, error: 'Unable to submit comment. This email address has been flagged or blocked.' };
      }

      const newComment: CommentItem = {
        id: 'cmt-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        target_type: data.targetType,
        target_id: data.targetId,
        author_name: data.authorName.trim(),
        author_email: email,
        content: data.content.trim(),
        status: 'pending',
        created_at: new Date().toISOString()
      };

      const current = getStoredComments();
      saveStoredComments([newComment, ...current]);

      if (isSupabaseConfigured) {
        try {
          await supabase.from('comments').insert([{
            target_type: data.targetType,
            target_id: data.targetId,
            author_name: data.authorName.trim(),
            author_email: email,
            content: data.content.trim(),
            status: 'pending',
          }]);
        } catch (err) {
          console.warn('Supabase comment insert:', err);
        }
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
      const local = getStoredComments();

      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('comments')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && data && data.length > 0) {
            const deleted = getDeletedCommentIds();
            const remote = (data as CommentItem[]).filter(c => !deleted.has(c.id));
            const remoteIds = new Set(remote.map(r => r.id));
            const localOnly = local.filter(l => !remoteIds.has(l.id));
            return { data: [...localOnly, ...remote] };
          }
        } catch { }
      }

      return { data: local };
    } catch (err: unknown) {
      const error = err as Error;
      return { data: getStoredComments(), error: error.message };
    }
  },

  /**
   * Admin: Update comment status ('approved' | 'rejected' | 'pending')
   */
  async updateCommentStatus(id: string, status: 'approved' | 'rejected' | 'pending'): Promise<{ success: boolean; error?: string }> {
    try {
      const current = getStoredComments();
      const updated = current.map(c => c.id === id ? { ...c, status } : c);
      saveStoredComments(updated);

      if (isSupabaseConfigured) {
        try {
          await supabase.from('comments').update({ status }).eq('id', id);
        } catch { }
      }

      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      return { success: false, error: error.message };
    }
  },

  /**
   * Admin: Delete comment permanently
   */
  async deleteComment(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      saveDeletedCommentId(id);
      const current = getStoredComments();
      saveStoredComments(current.filter(c => c.id !== id));

      if (isSupabaseConfigured) {
        try {
          await supabase.from('comments').delete().eq('id', id);
        } catch { }
      }

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
      const cleanEmail = email.trim().toLowerCase();
      const currentBlocked = getStoredBlockedEmails();
      if (!currentBlocked.some(b => b.email.toLowerCase() === cleanEmail)) {
        const newBlocked: BlockedEmail = {
          id: 'blk-' + Date.now(),
          email: cleanEmail,
          reason: reason || 'Blocked by administrator',
          created_at: new Date().toISOString()
        };
        saveStoredBlockedEmails([newBlocked, ...currentBlocked]);
      }

      // Reject all pending comments from this author
      const currentComments = getStoredComments();
      const updated = currentComments.map(c => {
        if (c.author_email.toLowerCase() === cleanEmail && c.status === 'pending') {
          return { ...c, status: 'rejected' as const };
        }
        return c;
      });
      saveStoredComments(updated);

      if (isSupabaseConfigured) {
        try {
          const { data: userData } = await supabase.auth.getUser();
          await supabase.from('blocked_emails').insert([{
            email: cleanEmail,
            reason: reason || 'Blocked by administrator',
            blocked_by: userData?.user?.id || null,
          }]);
          await supabase.from('comments').update({ status: 'rejected' }).eq('author_email', cleanEmail).eq('status', 'pending');
        } catch { }
      }

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
      const local = getStoredBlockedEmails();
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('blocked_emails')
            .select('*')
            .order('created_at', { ascending: false });
          if (!error && data) {
            return { data: data as BlockedEmail[] };
          }
        } catch { }
      }
      return { data: local };
    } catch (err: unknown) {
      const error = err as Error;
      return { data: getStoredBlockedEmails(), error: error.message };
    }
  },

  /**
   * Admin: Unblock an email
   */
  async unblockEmail(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const current = getStoredBlockedEmails();
      saveStoredBlockedEmails(current.filter(b => b.id !== id));

      if (isSupabaseConfigured) {
        try {
          await supabase.from('blocked_emails').delete().eq('id', id);
        } catch { }
      }

      return { success: true };
    } catch (err: unknown) {
      const error = err as Error;
      return { success: false, error: error.message };
    }
  }
};
