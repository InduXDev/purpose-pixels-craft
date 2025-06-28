import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';

interface MultiImageUploadProps {
  values: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  showPreview?: boolean;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  maxImages?: number;
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  values,
  onChange,
  label = "Images",
  placeholder = "Upload images or enter URLs",
  className = "",
  showPreview = true,
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  maxImages = 6,
}) => {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFileUpload = async (files: FileList) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upload images.",
        variant: "destructive",
      });
      return;
    }
    const newUrls: string[] = [];
    setUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!acceptedTypes.includes(file.type)) {
          toast({
            title: "Invalid file type",
            description: `Please upload a valid image file (${acceptedTypes.join(', ')})`,
            variant: "destructive",
          });
          continue;
        }
        if (file.size > maxSize * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `Please upload an image smaller than ${maxSize}MB`,
            variant: "destructive",
          });
          continue;
        }
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from('uploads')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });
        if (error) {
          toast({
            title: "Upload failed",
            description: error.message,
            variant: "destructive",
          });
          continue;
        }
        const { data: { publicUrl } } = supabase.storage
          .from('uploads')
          .getPublicUrl(fileName);
        newUrls.push(publicUrl);
      }
      if (newUrls.length > 0) {
        onChange([...values, ...newUrls].slice(0, maxImages));
        toast({
          title: "Images uploaded successfully",
          description: `${newUrls.length} image(s) uploaded and ready to use.`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
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
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const newUrls = [...values];
    newUrls[idx] = e.target.value;
    onChange(newUrls);
  };

  const addUrlField = () => {
    if (values.length < maxImages) {
      onChange([...values, '']);
    }
  };

  const removeImage = (idx: number) => {
    const newUrls = values.filter((_, i) => i !== idx);
    onChange(newUrls);
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
          disabled={uploading || values.length >= maxImages}
          multiple
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
              {uploading ? 'Uploading...' : `Drag and drop images here, or click to select (up to ${maxImages})`}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Max size: {maxSize}MB • Accepted: {acceptedTypes.map(type => type.split('/')[1]).join(', ')}
            </p>
          </div>
        </div>
      </div>
      {/* URL Inputs */}
      <div className="space-y-2">
        <Label>Or enter image URLs</Label>
        {values.map((url, idx) => (
          <div key={idx} className="flex gap-2 items-center mb-2">
            <Input
              type="url"
              value={url}
              onChange={e => handleUrlChange(e, idx)}
              placeholder={placeholder}
              className="flex-1"
            />
            <Button type="button" variant="ghost" size="icon" onClick={() => removeImage(idx)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {values.length < maxImages && (
          <Button type="button" variant="outline" size="sm" onClick={addUrlField}>
            Add Image URL
          </Button>
        )}
      </div>
      {/* Preview */}
      {showPreview && values.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
          {values.map((url, idx) => (
            <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <img
                src={url}
                alt={`Preview ${idx + 1}`}
                className="w-full h-32 object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-white/80 dark:bg-gray-900/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
              >
                <X className="w-4 h-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiImageUpload; 