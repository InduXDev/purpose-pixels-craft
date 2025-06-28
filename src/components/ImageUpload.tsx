import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  showPreview?: boolean;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = "Image",
  placeholder = "Upload an image or enter URL",
  className = "",
  showPreview = true,
  maxSize = 5, // 5MB default
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload images.",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: `Please upload a valid image file (${acceptedTypes.join(', ')})`,
        variant: "destructive",
      });
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `Please upload an image smaller than ${maxSize}MB`,
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName);

      onChange(publicUrl);

      toast({
        title: "Image uploaded successfully",
        description: "Your image has been uploaded and is ready to use.",
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const clearImage = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Label>{label}</Label>
      
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive 
            ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20' 
            : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        
        <div className="space-y-2">
          <div className="flex justify-center">
            {uploading ? (
              <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {uploading ? 'Uploading...' : 'Drag and drop an image here, or click to select'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Max size: {maxSize}MB • Accepted: {acceptedTypes.map(type => type.split('/')[1]).join(', ')}
            </p>
          </div>
        </div>
      </div>

      {/* URL Input */}
      <div className="space-y-2">
        <Label htmlFor="image-url">Or enter image URL</Label>
        <div className="flex gap-2">
          <Input
            id="image-url"
            type="url"
            value={value}
            onChange={handleUrlChange}
            placeholder={placeholder}
            className="flex-1"
            disabled={uploading}
          />
          {value && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={clearImage}
              disabled={uploading}
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Preview */}
      {showPreview && value && (
        <div className="space-y-2">
          <Label>Preview</Label>
          <div className="relative group">
            <img
              src={value}
              alt="Preview"
              className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
              onError={() => {
                toast({
                  title: "Invalid image URL",
                  description: "Please check the image URL and try again.",
                  variant: "destructive",
                });
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-gray-800"
                onClick={clearImage}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
