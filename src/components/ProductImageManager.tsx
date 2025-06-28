import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import ImageUpload from '@/components/ImageUpload';
import { X, Loader2 } from 'lucide-react';

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

  const handleImageUpload = (url: string) => {
    setNewImageUrl(url);
    if (url.trim()) {
      addImage();
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
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900 dark:text-gray-100">Add Product Images</h4>
        <ImageUpload
          value={newImageUrl}
          onChange={handleImageUpload}
          label="Upload Image"
          placeholder="Upload product image or enter URL"
          showPreview={false}
          maxSize={5}
        />
      </div>

      {images.length > 0 && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Product Images ({images.length})</h4>
          
          {images.length === 1 ? (
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <div className="relative group">
                  <img
                    src={images[0].image_url}
                    alt="Product"
                    className="w-full h-48 object-cover rounded"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded flex items-center justify-center">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => removeImage(images[0].id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="relative">
              <Carousel className="w-full">
                <CarouselContent>
                  {images.map((image) => (
                    <CarouselItem key={image.id}>
                      <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <CardContent className="p-4">
                          <div className="relative group">
                            <img
                              src={image.image_url}
                              alt="Product"
                              className="w-full h-48 object-cover rounded"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded flex items-center justify-center">
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => removeImage(image.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
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
