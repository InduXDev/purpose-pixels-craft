import { useEffect, useState } from 'react';
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
  };
}

const PostsFeed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const { toast } = useToast();

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
  }, [toast]);

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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Community Stories</h2>
        <p className="text-gray-600 dark:text-gray-400">Discover amazing stories from our artisan community</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {posts.map((post, index) => (
          <div
            key={post.id}
            style={{
              animationDelay: `${index * 0.1}s`
            }}
            onClick={() => setSelectedPost(post)}
            className="cursor-pointer"
          >
            <PostCard post={post} />
          </div>
        ))}
      </div>
      {/* Big view modal */}
      <Dialog open={!!selectedPost} onOpenChange={() => setSelectedPost(null)}>
        <DialogContent className="max-w-2xl w-full">
          {selectedPost && (
            <div className="overflow-y-auto max-h-[80vh]">
              <PostCard post={selectedPost} />
              {/* Optionally, you can add more details or comments here */}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostsFeed;
