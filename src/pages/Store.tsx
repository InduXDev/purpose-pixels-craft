
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
import { Plus, MapPin, Clock, Star, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ProductStory from '@/components/ProductStory';

interface Product {
  id: string;
  title: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  condition: string | null;
  location: string | null;
  created_at: string;
  user_id: string;
  profiles?: {
    username?: string;
    full_name?: string;
  };
}

const Store = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (productsError) {
          throw productsError;
        }

        if (!productsData || productsData.length === 0) {
          setProducts([]);
          return;
        }

        const userIds = [...new Set(productsData.map(product => product.user_id))];
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, username, full_name')
          .in('id', userIds);

        if (profilesError) {
          console.error('Error fetching profiles:', profilesError);
        }

        const productsWithProfiles = productsData.map(product => ({
          ...product,
          profiles: profilesData?.find(profile => profile.id === product.user_id) || undefined
        }));

        setProducts(productsWithProfiles);
      } catch (error: any) {
        toast({
          title: "Error loading products",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  const handleViewDetails = (product: Product) => {
    // Convert product to the format expected by ProductStory
    const storyProduct = {
      id: parseInt(product.id.slice(-8), 16), // Convert UUID to number for demo
      name: product.title,
      price: `₹${product.price.toLocaleString('en-IN')}`,
      image: product.image_url || '/placeholder.svg',
      story: product.description || 'A beautiful handcrafted item made with love and attention to detail.',
      impact: ['Handmade', 'Sustainable', 'Local Artisan', 'Eco-friendly'],
      timeToMake: '2-3 days',
      materials: product.condition || 'High-quality materials',
      originalId: product.id // Pass the original UUID
    };
    setSelectedProduct(storyProduct);
  };

  if (!user) {
    return (
      <div className="flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold">Store</h1>
          </div>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Log In</h2>
              <p className="text-gray-600 mb-6">You need to be logged in to access the store.</p>
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
            <h1 className="text-xl font-semibold">Store</h1>
          </div>
          <Button onClick={() => navigate('/create-product')}>
            <Plus className="w-4 h-4 mr-2" />
            List Product
          </Button>
        </div>
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
                  <span className="text-gray-600">Loading products...</span>
                </div>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No products available</h3>
                <p className="text-gray-600 mb-6">Be the first to list a product in our store!</p>
                <Button onClick={() => navigate('/create-product')}>
                  <Plus className="w-4 h-4 mr-2" />
                  List Your First Product
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Artisan Marketplace</h2>
                  <p className="text-gray-600">Discover unique handcrafted items from our community</p>
                </div>
                
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {products.map((product) => (
                    <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="aspect-square overflow-hidden bg-gray-100">
                        <img
                          src={product.image_url || '/placeholder.svg'}
                          alt={product.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg line-clamp-1">{product.title}</CardTitle>
                            <CardDescription className="text-sm">
                              by {product.profiles?.full_name || product.profiles?.username || 'Anonymous'}
                            </CardDescription>
                          </div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-gray-600 ml-1">4.8</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          {product.description && (
                            <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                          )}
                          
                          <div className="flex flex-wrap gap-1">
                            {product.category && (
                              <Badge variant="secondary" className="text-xs">{product.category}</Badge>
                            )}
                            {product.condition && (
                              <Badge variant="outline" className="text-xs">{product.condition}</Badge>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-xl font-bold text-orange-600">
                              ₹{product.price.toLocaleString('en-IN')}
                            </div>
                            <div className="flex items-center text-xs text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatDistanceToNow(new Date(product.created_at), { addSuffix: true })}
                            </div>
                          </div>

                          {product.location && (
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="w-4 h-4 mr-1" />
                              {product.location}
                            </div>
                          )}

                          <Button 
                            className="w-full" 
                            onClick={() => handleViewDetails(product)}
                          >
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </SidebarInset>

      {selectedProduct && (
        <ProductStory
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
};

export default Store;
