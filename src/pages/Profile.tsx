
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { User, Edit2, Save, X, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

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

const Profile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    full_name: '',
    bio: '',
    avatar_url: '',
  });
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          throw error;
        }

        setProfile(data);
        setEditForm({
          username: data.username || '',
          full_name: data.full_name || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
        });
      } catch (error: any) {
        toast({
          title: "Error loading profile",
          description: error.message,
          variant: "destructive",
        });
      }
    };

    const fetchUserProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, title, price, image_url, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) {
          throw error;
        }

        setProducts(data || []);
      } catch (error: any) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    fetchUserProducts();
  }, [user, toast]);

  const handleSave = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          username: editForm.username || null,
          full_name: editForm.full_name || null,
          bio: editForm.bio || null,
          avatar_url: editForm.avatar_url || null,
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }

      setProfile(prev => prev ? {
        ...prev,
        username: editForm.username || null,
        full_name: editForm.full_name || null,
        bio: editForm.bio || null,
        avatar_url: editForm.avatar_url || null,
      } : null);

      setEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .eq('user_id', user?.id);

      if (error) {
        throw error;
      }

      setProducts(products.filter(p => p.id !== productId));
      toast({
        title: "Product deleted",
        description: "Your product has been successfully deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Error deleting product",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold">Profile</h1>
          </div>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Please Log In</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">You need to be logged in to view your profile.</p>
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
        <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold">Profile</h1>
          </div>
          {!editing && (
            <Button 
              onClick={() => setEditing(true)} 
              variant="outline"
              size="sm"
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
        <div className="p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback>
                      <User className="w-8 h-8" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold">
                      {editing ? (
                        <Input
                          value={editForm.full_name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, full_name: e.target.value }))}
                          placeholder="Full Name"
                          className="text-xl font-bold border-0 p-0 h-auto"
                        />
                      ) : (
                        profile?.full_name || 'Add your name'
                      )}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      @{editing ? (
                        <Input
                          value={editForm.username}
                          onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                          placeholder="username"
                          className="inline w-auto border-0 p-0 h-auto text-gray-600 dark:text-gray-400"
                        />
                      ) : (
                        profile?.username || 'username'
                      )}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {editing && (
                  <div>
                    <Label htmlFor="avatar_url" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Profile Picture URL
                    </Label>
                    <Input
                      id="avatar_url"
                      value={editForm.avatar_url}
                      onChange={(e) => setEditForm(prev => ({ ...prev, avatar_url: e.target.value }))}
                      placeholder="https://example.com/your-image.jpg"
                      className="mt-1"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="bio" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Bio
                  </Label>
                  {editing ? (
                    <Textarea
                      id="bio"
                      value={editForm.bio}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself and your craft..."
                      className="mt-1"
                      rows={4}
                    />
                  ) : (
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                      {profile?.bio || 'Add a bio to tell people about yourself and your craft.'}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-orange-600">
                          {profile?.posts_count || 0}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Posts</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-orange-600">
                          {products.length}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Products</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-orange-600">
                          {profile?.created_at ? new Date(profile.created_at).getFullYear() : 'N/A'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Member Since</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {editing && (
                  <div className="flex gap-2 justify-end">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setEditing(false);
                        setEditForm({
                          username: profile?.username || '',
                          full_name: profile?.full_name || '',
                          bio: profile?.bio || '',
                          avatar_url: profile?.avatar_url || '',
                        });
                      }}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                    <Button onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* User's Products */}
            {products.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                      <Card key={product.id} className="relative">
                        <div className="aspect-square overflow-hidden bg-gray-100 dark:bg-gray-800 rounded-t-lg">
                          <img
                            src={product.image_url || '/placeholder.svg'}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-medium line-clamp-1">{product.title}</h3>
                          <p className="text-lg font-bold text-orange-600">
                            ₹{product.price.toLocaleString('en-IN')}
                          </p>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-600 hover:text-red-700 dark:bg-gray-800/80 dark:hover:bg-gray-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{product.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </SidebarInset>
    </div>
  );
};

export default Profile;
