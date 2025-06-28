import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import PostCard from './PostCard';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent } from './ui/dialog';

interface Post {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  user_id: string;
  profiles?: {
    username?: string;
    full_name?: string;
    avatar_url?: string;
    id?: string;
  };
}

const PostsFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [autoOpenComments, setAutoOpenComments] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // First get posts
        const { data: postsData, error: postsError } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (postsError) {
          throw postsError;
        }

        if (!postsData || postsData.length === 0) {
          setPosts([]);
          return;
        }

        // Get unique user IDs from posts
        const userIds = [...new Set(postsData.map(post => post.user_id))];

        // Fetch profiles for these users
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, full_name, avatar_url')
          .in('id', userIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
          // Continue without profiles data
        }

        // Combine posts with profile data
        const postsWithProfiles = postsData.map(post => ({
          ...post,
          profiles: profilesData?.find(profile => profile.id === post.user_id) || undefined
        }));

        setPosts(postsWithProfiles);

        // Check for ?post=... param
        const postId = searchParams.get('post');
        if (postId) {
          const found = postsWithProfiles.find(p => p.id === postId);
          if (found) {
            setSelectedPost(found);
            setAutoOpenComments(false);
          }
        }
      } catch (error: any) {
        toast({
          title: "Error loading posts",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    // Set up real-time subscription for new posts
    const subscription = supabase
      .channel('posts')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'posts' 
        }, 
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast, searchParams]);

  const handleUserClick = (userId: string) => {
    setSelectedPost(null);
    navigate(`/profile?user=${userId}`);
  };

  // Open post in modal and optionally focus comments
  const handleOpenPost = (post: Post, focusComments = false) => {
    setSelectedPost(post);
    setAutoOpenComments(focusComments);
    setSearchParams(focusComments ? { post: post.id, comments: '1' } : { post: post.id });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-orange-600 dark:text-orange-400" />
          <span className="text-gray-600 dark:text-gray-300">Loading posts...</span>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No posts yet</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">Be the first to share your story!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 animate-fade-in">Community Stories</h2>
        <p className="text-gray-600 dark:text-gray-400 animate-fade-in delay-100">Discover amazing stories from our artisan community</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {posts.map((post, index) => (
          <div
            key={post.id}
            style={{
              animationDelay: `${index * 80}ms`
            }}
            onClick={() => handleOpenPost(post, false)}
            className="cursor-pointer animate-fade-slide-in"
          >
            <PostCard
              post={post}
              onUserClick={handleUserClick}
              autoOpenComments={false}
              onCommentClick={() => handleOpenPost(post, true)}
            />
          </div>
        ))}
      </div>
      {/* Big view modal */}
      <Dialog open={!!selectedPost} onOpenChange={() => { setSelectedPost(null); setSearchParams({}); }}>
        <DialogContent className="max-w-2xl w-full animate-modal-pop">
          {selectedPost && (
            <div className="overflow-y-auto max-h-[80vh] animate-fade-in">
              <PostCard
                post={selectedPost}
                onUserClick={handleUserClick}
                autoOpenComments={autoOpenComments}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostsFeed;
