import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import PostsFeed from '@/components/PostsFeed';
import ImpactMetrics from '@/components/ImpactMetrics';
import { Heart, MessageCircle, Share2, TrendingUp, Users, Package, Sparkles } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalUsers: 0,
    totalProducts: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [postsResult, usersResult, productsResult] = await Promise.all([
          supabase.from('posts').select('id', { count: 'exact', head: true }),
          supabase.from('profiles').select('id', { count: 'exact', head: true }),
          supabase.from('products').select('id', { count: 'exact', head: true }),
        ]);

        setStats({
          totalPosts: postsResult.count || 0,
          totalUsers: usersResult.count || 0,
          totalProducts: productsResult.count || 0,
        });
      } catch (error: any) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  if (!user) {
    return (
      <div className="flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Artisan Stories</h1>
          </div>
          <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-800">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-amber-600/10 dark:from-orange-600/5 dark:to-amber-600/5" />
              <div className="relative px-6 py-24 sm:px-12 sm:py-32 lg:px-16">
                <div className="mx-auto max-w-2xl text-center">
                  <div className="mb-8 flex justify-center">
                    <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-gray-600 dark:text-gray-300 ring-1 ring-gray-900/10 dark:ring-gray-100/10 hover:ring-gray-900/20 dark:hover:ring-gray-100/20">
                      Join our community of artisans.{' '}
                      <button
                        onClick={() => navigate('/auth')}
                        className="font-semibold text-orange-600 dark:text-orange-400"
                      >
                        <span className="absolute inset-0" aria-hidden="true" />
                        Get started <span aria-hidden="true">&rarr;</span>
                      </button>
                    </div>
                  </div>
                  <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl">
                    Share Your{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">
                      Craft Stories
                    </span>
                  </h1>
                  <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
                    Connect with fellow artisans, share your creative journey, and discover unique handcrafted products. 
                    Every creation has a story worth telling.
                  </p>
                  <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Button
                      onClick={() => navigate('/auth')}
                      size="lg"
                      className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3"
                    >
                      Start Your Journey
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => navigate('/store')}
                      size="lg"
                      className="px-8 py-3 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      Explore Store
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="py-16 px-6 sm:px-12 lg:px-16">
              <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-orange-200 dark:border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Heart className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="ml-4">
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalPosts}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Stories Shared</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-orange-200 dark:border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Users className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="ml-4">
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalUsers}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Artisans</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-orange-200 dark:border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <Package className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div className="ml-4">
                          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalProducts}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Products Listed</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="py-16 px-6 sm:px-12 lg:px-16 bg-white/50 dark:bg-gray-900/50">
              <div className="mx-auto max-w-7xl">
                <div className="text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
                    Everything you need to share your craft
                  </h2>
                  <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                    From storytelling to selling, we've got you covered.
                  </p>
                </div>

                <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <Sparkles className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <CardTitle className="text-gray-900 dark:text-gray-100">Share Your Story</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        Tell the world about your creative process, inspiration, and the story behind each piece.
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <Package className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <CardTitle className="text-gray-900 dark:text-gray-100">Sell Your Crafts</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        List your handmade products in our marketplace and reach customers who appreciate authentic craftsmanship.
                      </CardDescription>
                    </CardContent>
                  </Card>

                  <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <CardTitle className="text-gray-900 dark:text-gray-100">Connect & Learn</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        Join a community of passionate makers, share techniques, and learn from fellow artisans.
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </div>
    );
  }

  return (
    <div className="flex w-full">
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Home</h1>
        </div>
        <div className="flex-1 space-y-6 p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-100">Total Posts</p>
                    <p className="text-2xl font-bold">{stats.totalPosts}</p>
                  </div>
                  <Heart className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-100">Community</p>
                    <p className="text-2xl font-bold">{stats.totalUsers}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-100">Products</p>
                    <p className="text-2xl font-bold">{stats.totalProducts}</p>
                  </div>
                  <Package className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-100">Growth</p>
                    <p className="text-2xl font-bold">+12%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <PostsFeed />
            </div>
            <div>
              <ImpactMetrics />
            </div>
          </div>
        </div>
      </SidebarInset>
    </div>
  );
};

export default Index;
