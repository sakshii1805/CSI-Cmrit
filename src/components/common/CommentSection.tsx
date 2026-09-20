import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { commentsService } from '../../services/commentsService';
import { PublicComment, CommentTargetType } from '../../types';
import { Button } from './Button';

interface CommentSectionProps {
  targetType: CommentTargetType;
  targetId: string;
  targetTitle?: string;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  targetType,
  targetId,
  targetTitle
}) => {
  const [comments, setComments] = useState<PublicComment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [content, setContent] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Spam honeypot
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [cooldownSeconds, setCooldownSeconds] = useState(0);

  // Fetch approved comments
  const loadComments = async () => {
    try {
      setIsLoading(true);
      const res = await commentsService.getApprovedComments(targetType, targetId);
      setComments(res.data);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [targetType, targetId]);

  // Cooldown timer
  useEffect(() => {
    if (cooldownSeconds > 0) {
      const timer = setTimeout(() => setCooldownSeconds((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownSeconds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Spam honeypot check
    if (honeypot.trim()) {
      return; // Silent reject for bots
    }

    // Cooldown check
    if (cooldownSeconds > 0) {
      setErrorMessage(`Please wait ${cooldownSeconds}s before submitting another comment.`);
      return;
    }

    if (!authorName.trim() || !authorEmail.trim() || !content.trim()) {
      setErrorMessage('Please fill in your name, email, and comment message.');
      return;
    }

    if (content.trim().length < 5) {
      setErrorMessage('Comment must be at least 5 characters long.');
      return;
    }

    if (content.trim().length > 1000) {
      setErrorMessage('Comment exceeds maximum allowed length of 1000 characters.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await commentsService.submitComment({
        targetType,
        targetId,
        authorName,
        authorEmail,
        content,
      });

      if (!res.success) {
        setErrorMessage(res.error || 'Failed to submit comment.');
        return;
      }

      setSubmitSuccess(true);
      setContent('');
      setCooldownSeconds(30); // 30-second cooldown
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-12 pt-8 border-t border-slate-200/80">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h3 className="font-display text-lg font-bold text-slate-900">
            Comments &amp; Reflections {comments.length > 0 && <span className="text-slate-400 font-normal">({comments.length})</span>}
          </h3>
        </div>
      </div>

      {/* Comment Submission Form */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 mb-8">
        <h4 className="text-sm font-bold text-slate-900 mb-1">Leave a Thought</h4>
        <p className="text-xs text-slate-500 mb-4">
          Public comments are moderated and will appear after review by chapter coordinators.
        </p>

        {submitSuccess && (
          <div className="mb-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Thanks! Your comment will appear after admin approval.</p>
              <p className="text-emerald-700/80 mt-0.5">Thank you for sharing your feedback with the CSI CMRIT community.</p>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Honeypot field (hidden from legitimate users) */}
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              name="website_url_hp"
              tabIndex={-1}
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address * <span className="text-slate-400 font-normal">(Never shown publicly)</span>
              </label>
              <input
                type="email"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                placeholder="you@gmail.com"
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Your Message / Comment * <span className="text-slate-400 font-normal">({1000 - content.length} chars left)</span>
            </label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Share your experience or inquiry regarding ${targetTitle || 'this post'}...`}
              maxLength={1000}
              className="w-full p-3 text-xs rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              required
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5" />
              {cooldownSeconds > 0 ? `Wait ${cooldownSeconds}s` : 'Standard cooldown applies'}
            </span>

            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={isSubmitting || cooldownSeconds > 0}
              rightIcon={<Send className="w-3.5 h-3.5" />}
            >
              {isSubmitting ? 'Submitting...' : 'Post Comment'}
            </Button>
          </div>
        </form>
      </div>

      {/* Approved Comments List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-6 text-xs text-slate-400 font-mono">
            Loading thoughts...
          </div>
        ) : comments.length > 0 ? (
          comments.map((c) => (
            <div
              key={c.id}
              className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center">
                    {c.author_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs font-bold text-slate-900">{c.author_name}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  {new Date(c.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed pl-8">
                {c.content}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl">
            <p className="text-xs text-slate-500">No public comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </div>
    </div>
  );
};
