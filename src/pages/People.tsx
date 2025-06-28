import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MessageUserButton } from '@/components/MessageUserButton';
import { Search, User, FileText } from 'lucide-react';

interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  posts_count: number | null;
  created_at: string;
}

interface Product {
  id: string;
  title: string;
  price: number;
  image_url: string | null;
  created_at: string;
}

const People = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [userProducts, setUserProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if we should auto-open a specific user's profile
  useEffect(() => {
    const userId = searchParams.get('user');
    if (userId && user) {
      // Auto-fetch and show the specific user's profile
      fetchSpecificUserProfile(userId);
    }
  }, [searchParams, user]);

  const fetchSpecificUserProfile = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setSelectedProfile(data);
        // Also fetch their products
        fetchUserProducts(data);
      }
    } catch (error: any) {
      toast({
        title: "Error loading profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProducts = async (profile: Profile) => {
    setLoadingProducts(true);
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, title, price, image_url, created_at')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false })
        .limit(6);

      if (error) {
        throw error;
      }

      setUserProducts(data || []);
    } catch (error: any) {
      console.error('Error loading user products:', error);
      setUserProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`username.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%`)
        .limit(20);

      if (error) {
        throw error;
      }

      setSearchResults(data || []);
    } catch (error: any) {
      toast({
        title: "Error searching people",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleViewProfile = async (profile: Profile) => {
    setSelectedProfile(profile);
    fetchUserProducts(profile);
  };

  const handleProductClick = (product: Product, userId: string) => {
    // Navigate to store with user filter and specific product
    navigate(`/store?user=${userId}&product=${product.id}`);
  };

  const handleViewAllProducts = (userId: string) => {
    // Navigate to store filtered by user
    navigate(`/store?user=${userId}`);
  };

  if (!user) {
    return (
      <div className="flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">People</h1>
          </div>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Please Log In</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">You need to be logged in to search for people.</p>
              <Button onClick={() => navigate('/auth')}>
                Sign In
              </Button>
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
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">People</h1>
        </div>
        <div className="p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Find People</h2>
              <p className="text-gray-600 dark:text-gray-400">Search for people by their username or name</p>
            </div>

            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by username or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((profile) => (
                  <Card key={profile.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={profile.avatar_url || ''} />
                          <AvatarFallback>
                            <User className="w-6 h-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg truncate text-gray-900 dark:text-gray-100">
                            {profile.full_name || 'Anonymous User'}
                          </CardTitle>
                          <CardDescription className="truncate text-gray-600 dark:text-gray-400">
                            @{profile.username || 'username'}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      {profile.bio && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{profile.bio}</p>
                      )}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <FileText className="w-4 h-4 mr-1" />
                          {profile.posts_count || 0} posts
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleViewProfile(profile)}
                        >
                          View Profile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {searchTerm && !loading && searchResults.length === 0 && (
              <div className="text-center py-8">
                <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No people found</h3>
                <p className="text-gray-600 dark:text-gray-400">Try searching with different keywords.</p>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>

      {/* Profile Dialog */}
      <Dialog open={!!selectedProfile} onOpenChange={() => setSelectedProfile(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProfile && (
            <>
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-gray-100">Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={selectedProfile.avatar_url || ''} />
                    <AvatarFallback>
                      <User className="w-10 h-10" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {selectedProfile.full_name || 'Anonymous User'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">@{selectedProfile.username || 'username'}</p>
                  </div>
                  <MessageUserButton 
                    userId={selectedProfile.id} 
                    userName={selectedProfile.full_name || selectedProfile.username || 'User'} 
                  />
                </div>

                {selectedProfile.bio && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Bio</h3>
                    <p className="text-gray-600 dark:text-gray-400">{selectedProfile.bio}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-orange-600">
                          {selectedProfile.posts_count || 0}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Posts</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-orange-600">
                          {new Date(selectedProfile.created_at).getFullYear()}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* User's Products */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">Products</h3>
                    {userProducts.length > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewAllProducts(selectedProfile.id)}
                      >
                        View All Products
                      </Button>
                    )}
                  </div>
                  {loadingProducts ? (
                    <div className="text-center py-4">Loading products...</div>
                  ) : userProducts.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {userProducts.map((product) => (
                        <Card 
                          key={product.id} 
                          className="cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => handleProductClick(product, selectedProfile.id)}
                        >
                          <div className="aspect-square overflow-hidden bg-gray-100 rounded-t-lg">
                            <img
                              src={product.image_url || '/placeholder.svg'}
                              alt={product.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h4 className="font-medium line-clamp-1 text-gray-900 dark:text-gray-100">{product.title}</h4>
                            <p className="text-lg font-bold text-orange-600">
                              ₹{product.price.toLocaleString('en-IN')}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">No products listed</p>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default People;
