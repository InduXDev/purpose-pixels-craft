
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Link, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ImageUploadProps {
  onImageSelect: (imageUrl: string) => void;
  label?: string;
  currentImage?: string;
}

const ImageUpload = ({ onImageSelect, label = "Image", currentImage }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const { toast } = useToast();

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('uploads')
        .getPublicUrl(filePath);

      onImageSelect(data.publicUrl);
      
      toast({
        title: "Image uploaded successfully",
        description: "Your image has been uploaded and selected.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }
      uploadImage(file);
    }
  };

  const handleUrlSubmit = () => {
    if (imageUrl.trim()) {
      onImageSelect(imageUrl.trim());
      setImageUrl('');
      toast({
        title: "Image URL added",
        description: "Image URL has been set successfully.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium">{label}</Label>
      
      {currentImage && (
        <div className="relative w-full h-32 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
          <img
            src={currentImage}
            alt="Current"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload File</TabsTrigger>
          <TabsTrigger value="url">Image URL</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload" className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              className="file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-sm file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
            />
            <Button disabled={uploading} size="sm">
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="url" className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Enter image URL..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <Button onClick={handleUrlSubmit} disabled={!imageUrl.trim()} size="sm">
              <Link className="w-4 h-4" />
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ImageUpload;
