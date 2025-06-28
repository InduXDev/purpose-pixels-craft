import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, User, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ContentWithVideos from './ContentWithVideos';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import type { Database } from '@/integrations/supabase/types';

type PostLike = Database['public']['Tables']['post_likes']['Row'];
type PostComment = Database['public']['Tables']['post_comments']['Row'] & {
  profiles: { full_name?: string; username?: string; avatar_url?: string };
};

interface Post {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  profiles?: {
    username?: string;
    full_name?: string;
    avatar_url?: string;
    id?: string;
  };
}

interface PostCardProps {
  post: Post;
  onUserClick?: (userId: string) => void;
}

const PostCard = ({ post, onUserClick }: PostCardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComment, setLoadingComment] = useState(false);

  const displayName = post.profiles?.full_name || post.profiles?.username || 'Anonymous User';
  const userId = post.profiles?.id;

  // Fetch like and comment counts, and if user liked
  useEffect(() => {
    let isMounted = true;
    const fetchCounts = async () => {
      const [{ count: likeCount }, { count: commentCount }] = await Promise.all([
        supabase.from('post_likes').select('*', { count: 'exact', head: true }).eq('post_id', post.id),
        supabase.from('post_comments').select('*', { count: 'exact', head: true }).eq('post_id', post.id),
      ]);
      if (isMounted) {
        setLikeCount(likeCount || 0);
        setCommentCount(commentCount || 0);
      }
    };
    const fetchLiked = async () => {
      if (user) {
        const { data } = await supabase.from('post_likes').select('id').eq('post_id', post.id).eq('user_id', user.id).single();
        setLiked(!!data);
      } else {
        setLiked(false);
      }
    };
    fetchCounts();
    fetchLiked();
    return () => { isMounted = false; };
  }, [post.id, user]);

  // Like/unlike logic
  const handleLike = async () => {
    if (!user) {
      toast({ title: 'Login required', description: 'Please log in to like posts.', variant: 'destructive' });
      return;
    }
    if (liked) {
      // Unlike
      const { error } = await supabase.from('post_likes').delete().eq('post_id', post.id).eq('user_id', user.id);
      if (!error) {
        setLiked(false);
        setLikeCount(likeCount - 1);
      }
    } else {
      // Like
      const { error } = await supabase.from('post_likes').insert({ post_id: post.id, user_id: user.id });
      if (!error) {
        setLiked(true);
        setLikeCount(likeCount + 1);
      }
    }
  };

  // Comments logic
  const openComments = async () => {
    setShowComments(true);
    // Fetch comments
    const { data, error } = await supabase
      .from('post_comments')
      .select('id, content, created_at, profiles(full_name,username,avatar_url)')
      .eq('post_id', post.id)
      .order('created_at', { ascending: false });
    if (!error && data) {
      setComments(data as PostComment[]);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: 'Login required', description: 'Please log in to comment.', variant: 'destructive' });
      return;
    }
    if (!newComment.trim()) return;
    setLoadingComment(true);
    const { error } = await supabase.from('post_comments').insert({
      post_id: post.id,
      user_id: user.id,
      content: newComment.trim(),
    });
    setLoadingComment(false);
    if (!error) {
      setNewComment('');
      openComments();
      setCommentCount(commentCount + 1);
      toast({ title: 'Comment added!' });
    } else {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  };

  // Share logic
  const handleShare = async () => {
    const url = `${window.location.origin}/?post=${post.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast({ title: 'Link copied!', description: 'Post link copied to clipboard.' });
    } catch {
      toast({ title: 'Copy failed', description: url, variant: 'destructive' });
    }
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm animate-fade-in">
      {post.image_url && (
        <div className="aspect-video overflow-hidden">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      )}
      
      <CardContent className="p-6">
        {/* Author Info */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
            {post.profiles?.avatar_url ? (
              <img
                src={post.profiles.avatar_url}
                alt={displayName}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            )}
          </div>
          <div className="flex-1">
            {onUserClick && userId ? (
              <button
                type="button"
                className="font-medium text-orange-700 dark:text-orange-300 hover:underline focus:outline-none"
                onClick={e => {
                  e.stopPropagation();
                  onUserClick(userId);
                }}
              >
                {displayName}
              </button>
            ) : (
              <p className="font-medium text-gray-900 dark:text-gray-100">{displayName}</p>
            )}
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="w-3 h-3 mr-1" />
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </div>
          </div>
        </div>

        {/* Post Content */}
        <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-3 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
          {post.title}
        </h3>
        
        {post.content && (
          <div className="mb-4">
            <ContentWithVideos 
              content={post.content} 
              className="text-gray-600 dark:text-gray-300 line-clamp-3"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className={`transition-all duration-300 hover:scale-110 ${
                liked ? 'text-red-500 hover:text-red-600 dark:hover:text-red-400' : 'text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400'
              }`}
            >
              <Heart className={`w-4 h-4 mr-1 ${liked ? 'fill-current' : ''}`} />
              {likeCount}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={openComments}
              className="text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 hover:scale-110"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              {commentCount}
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-gray-500 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-all duration-300 hover:scale-110"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>

      {/* Comments Modal */}
      <Dialog open={showComments} onOpenChange={setShowComments}>
        <DialogContent className="max-w-lg w-full">
          <DialogTitle>Comments</DialogTitle>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {comments.length === 0 && <div className="text-gray-500 text-center">No comments yet.</div>}
            {comments.map((c) => (
              <div key={c.id} className="flex items-start gap-3 border-b pb-2">
                <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                  {c.profiles?.avatar_url ? (
                    <img src={c.profiles.avatar_url} alt="avatar" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    {c.profiles?.full_name || c.profiles?.username || 'Anonymous'}
                  </div>
                  <div className="text-gray-600 dark:text-gray-300 text-sm mb-1">{c.content}</div>
                  <div className="text-xs text-gray-400">{formatDistanceToNow(new Date(c.created_at), { addSuffix: true })}</div>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddComment} className="flex gap-2 pt-2">
            <input
              type="text"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 rounded border border-gray-300 dark:border-gray-700 px-3 py-2 text-sm bg-white dark:bg-gray-800"
              disabled={loadingComment}
              maxLength={500}
            />
            <Button type="submit" disabled={loadingComment || !newComment.trim()}>
              {loadingComment ? 'Posting...' : 'Post'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PostCard;
