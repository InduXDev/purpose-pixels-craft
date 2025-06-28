import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { X, Clock, Leaf, Heart, ShoppingCart } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import ContentWithVideos from "./ContentWithVideos";

interface ProductImage {
  id: string;
  image_url: string;
  order_index: number;
}

interface ProductStoryProps {
  product: {
    id: number;
    name: string;
    price: string;
    image: string;
    story: string;
    impact: string[];
    timeToMake: string;
    materials: string;
    originalId?: string;
  };
  onClose: () => void;
}

const ProductStory = ({ product, onClose }: ProductStoryProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [productImages, setProductImages] = useState<ProductImage[]>([]);

  useEffect(() => {
    if (product.originalId) {
      fetchProductImages();
    }
  }, [product.originalId]);

  const fetchProductImages = async () => {
    if (!product.originalId) return;
    
    try {
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', product.originalId)
        .order('order_index');

      if (error) throw error;
      setProductImages(data || []);
    } catch (error: any) {
      console.error('Error fetching product images:', error);
    }
  };

  const images = productImages.length > 0 
    ? productImages.map(img => img.image_url)
    : [product.image];

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to your cart.",
        variant: "destructive",
      });
      return;
    }

    setIsAddingToCart(true);
    try {
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: product.originalId || product.id.toString(),
          quantity: 1,
        });

      if (error) throw error;

      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error: any) {
      toast({
        title: "Error adding to cart",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to save items to your wishlist.",
        variant: "destructive",
      });
      return;
    }

    setIsAddingToWishlist(true);
    try {
      const { error } = await supabase
        .from('wishlist_items')
        .insert({
          user_id: user.id,
          product_id: product.originalId || product.id.toString(),
        });

      if (error) throw error;

      toast({
        title: "Saved to wishlist!",
        description: `${product.name} has been saved to your wishlist.`,
      });
    } catch (error: any) {
      toast({
        title: "Error saving to wishlist",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-0">
        <div className="grid md:grid-cols-2 h-full">
          {/* Image Section */}
          <div className="relative">
            {images.length === 1 ? (
              <img
                src={images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Carousel className="w-full h-full">
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem key={index}>
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
              </Carousel>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute top-4 right-4 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full p-2"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Content Section */}
          <div className="p-6 overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {product.name}
              </DialogTitle>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {product.price}
              </div>
            </DialogHeader>

            <div className="mt-6 space-y-6">
              {/* Product Story */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Product Story</h4>
                <div className="text-gray-600 dark:text-gray-300">
                  <ContentWithVideos content={product.story} />
                </div>
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Time to Make</h4>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Clock className="w-4 h-4 mr-2" />
                    {product.timeToMake}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Materials</h4>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <Leaf className="w-4 h-4 mr-2" />
                    {product.materials}
                  </div>
                </div>
              </div>

              {/* Impact Tags */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Social & Environmental Impact</h4>
                <div className="flex flex-wrap gap-2">
                  {product.impact.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              <Button 
                size="lg" 
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-full transition-all duration-300 hover:scale-105"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isAddingToCart ? "Adding..." : "Add to Cart"}
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full border-orange-600 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 py-3 rounded-full"
                onClick={handleAddToWishlist}
                disabled={isAddingToWishlist}
              >
                <Heart className="w-5 h-5 mr-2" />
                {isAddingToWishlist ? "Saving..." : "Save to Wishlist"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductStory;
