
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Heart, Trash2, ShoppingCart } from 'lucide-react';

interface WishlistItem {
  id: string;
  product: {
    id: string;
    title: string;
    price: number;
    image_url: string;
    description: string;
  };
}

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchWishlistItems();
    }
  }, [user]);

  const fetchWishlistItems = async () => {
    try {
      const { data, error } = await supabase
        .from('wishlist_items')
        .select(`
          id,
          product:products(id, title, price, image_url, description)
        `)
        .eq('user_id', user?.id);

      if (error) throw error;
      setWishlistItems(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading wishlist",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('id', itemId);

      if (error) throw error;
      fetchWishlistItems();
      toast({
        title: "Removed from wishlist",
        description: "Item has been removed from your wishlist",
      });
    } catch (error: any) {
      toast({
        title: "Error removing item",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addToCart = async (productId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .upsert({
          user_id: user?.id,
          product_id: productId,
          quantity: 1
        }, {
          onConflict: 'user_id,product_id'
        });

      if (error) throw error;
      toast({
        title: "Added to cart!",
        description: "Item has been added to your cart",
      });
    } catch (error: any) {
      toast({
        title: "Error adding to cart",
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
            <h1 className="text-xl font-semibold">Wishlist</h1>
          </div>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
              <p className="text-gray-600 mb-6">You need to be logged in to view your wishlist.</p>
              <Button onClick={() => navigate('/auth')}>Sign In</Button>
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
          <Heart className="w-5 h-5" />
          <h1 className="text-xl font-semibold">My Wishlist</h1>
        </div>
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            {loading ? (
              <div className="text-center py-12">Loading your wishlist...</div>
            ) : wishlistItems.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your wishlist is empty</h3>
                <p className="text-gray-600 mb-6">Save items you love for later!</p>
                <Button onClick={() => navigate('/store')}>Browse Products</Button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {wishlistItems.map((item) => (
                  <Card key={item.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                    <div className="aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={item.product.image_url || '/placeholder.svg'}
                        alt={item.product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg line-clamp-2">{item.product.title}</CardTitle>
                      <div className="text-xl font-bold text-orange-600">
                        ₹{item.product.price.toLocaleString('en-IN')}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{item.product.description}</p>
                      <div className="flex gap-2">
                        <Button 
                          className="flex-1 bg-orange-600 hover:bg-orange-700"
                          onClick={() => addToCart(item.product.id)}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFromWishlist(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </div>
  );
};

export default Wishlist;
