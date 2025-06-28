import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ImageUpload from '@/components/ImageUpload';
import ContentWithVideos from '@/components/ContentWithVideos';
import { Upload, Type, FileText, Eye, EyeOff } from 'lucide-react';
import { findVideoUrls } from '@/lib/videoEmbed';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const videoUrls = findVideoUrls(content);
  const hasVideos = videoUrls.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a post.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('posts')
        .insert({
          title,
          content,
          image_url: imageUrl || null,
          user_id: user.id,
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Post created!",
        description: "Your post has been published successfully.",
      });

      navigate('/');
    } catch (error: any) {
      toast({
        title: "Error creating post",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <Card className="w-full max-w-md text-center bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="pt-6">
            <p className="text-gray-600 dark:text-gray-300 mb-4">Please log in to create posts</p>
            <Button onClick={() => navigate('/auth')} className="bg-orange-600 hover:bg-orange-700">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Create New Post</h1>
          <p className="text-gray-600 dark:text-gray-300">Share your story with the community</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm animate-scale-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-gray-100">
                <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <span>Post Details</span>
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-300">
                Fill in the details below to create your post
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                    <Type className="w-4 h-4" />
                    <span>Title</span>
                  </label>
                  <Input
                    type="text"
                    placeholder="Enter your post title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="transition-all duration-300 focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                    <FileText className="w-4 h-4" />
                    <span>Content</span>
                    {hasVideos && (
                      <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full">
                        {videoUrls.length} video{videoUrls.length > 1 ? 's' : ''} detected
                      </span>
                    )}
                  </label>
                  <Textarea
                    placeholder="Tell your story... (YouTube, Vimeo, and Dailymotion links will be automatically embedded)"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-32 transition-all duration-300 focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                    rows={6}
                  />
                  {hasVideos && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Supported platforms: YouTube, Vimeo, Dailymotion
                    </div>
                  )}
                </div>

                <ImageUpload
                  value={imageUrl}
                  onChange={setImageUrl}
                  label="Post Image (optional)"
                  placeholder="Upload an image for your post or enter URL"
                  showPreview={true}
                  maxSize={5}
                />

                <div className="flex space-x-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="flex-1 transition-all duration-300 hover:scale-105 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !title.trim()}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white transition-all duration-300 hover:scale-105"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creating...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Upload className="w-4 h-4" />
                        <span>Publish Post</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Preview</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center space-x-2 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
              </Button>
            </div>

            {showPreview && (
              <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm animate-scale-in">
                <CardContent className="p-6">
                  {title && (
                    <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-3">
                      {title}
                    </h3>
                  )}
                  
                  {content && (
                    <div className="text-gray-600 dark:text-gray-300">
                      <ContentWithVideos content={content} />
                    </div>
                  )}

                  {imageUrl && (
                    <div className="mt-4 aspect-video overflow-hidden rounded-lg">
                      <img
                        src={imageUrl}
                        alt="Post preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {!title && !content && !imageUrl && (
                    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>Start typing to see a preview of your post</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
