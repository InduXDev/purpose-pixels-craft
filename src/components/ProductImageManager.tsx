
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { X, Plus, Loader2 } from 'lucide-react';

interface ProductImage {
  id: string;
  image_url: string;
  order_index: number;
}

interface ProductImageManagerProps {
  productId: string;
  onImagesChange?: (images: ProductImage[]) => void;
}

const ProductImageManager = ({ productId, onImagesChange }: ProductImageManagerProps) => {
  const [images, setImages] = useState<ProductImage[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingImages, setFetchingImages] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, [productId]);

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', productId)
        .order('order_index');

      if (error) throw error;

      setImages(data || []);
      onImagesChange?.(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading images",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setFetchingImages(false);
    }
  };

  const addImage = async () => {
    if (!newImageUrl.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_images')
        .insert({
          product_id: productId,
          image_url: newImageUrl,
          order_index: images.length
        })
        .select()
        .single();

      if (error) throw error;

      const updatedImages = [...images, data];
      setImages(updatedImages);
      setNewImageUrl('');
      onImagesChange?.(updatedImages);
      
      toast({
        title: "Image added",
        description: "Product image has been added successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error adding image",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeImage = async (imageId: string) => {
    try {
      const { error } = await supabase
        .from('product_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      const updatedImages = images.filter(img => img.id !== imageId);
      setImages(updatedImages);
      onImagesChange?.(updatedImages);
      
      toast({
        title: "Image removed",
        description: "Product image has been removed successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Error removing image",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (fetchingImages) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="new-image">Add Image URL</Label>
        <div className="flex gap-2">
          <Input
            id="new-image"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="Enter image URL..."
          />
          <Button onClick={addImage} disabled={loading || !newImageUrl.trim()}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {images.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium">Product Images ({images.length})</h4>
          
          {images.length === 1 ? (
            <Card>
              <CardContent className="p-4">
                <div className="relative">
                  <img
                    src={images[0].image_url}
                    alt="Product"
                    className="w-full h-48 object-cover rounded"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeImage(images[0].id)}
                    className="absolute top-2 right-2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="relative">
              <Carousel className="w-full">
                <CarouselContent>
                  {images.map((image) => (
                    <CarouselItem key={image.id}>
                      <Card>
                        <CardContent className="p-4">
                          <div className="relative">
                            <img
                              src={image.image_url}
                              alt="Product"
                              className="w-full h-48 object-cover rounded"
                            />
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeImage(image.id)}
                              className="absolute top-2 right-2"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductImageManager;
