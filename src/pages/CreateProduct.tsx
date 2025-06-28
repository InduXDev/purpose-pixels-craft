import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import ImageUpload from '@/components/ImageUpload';
import ContentWithVideos from '@/components/ContentWithVideos';
import { Package, Upload, Loader2, Eye, EyeOff } from 'lucide-react';
import { findVideoUrls } from '@/lib/videoEmbed';

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    image_url: '',
    category: '',
    condition: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const videoUrls = findVideoUrls(formData.description);
  const hasVideos = videoUrls.length > 0;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a product listing.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.title || !formData.price) {
      toast({
        title: "Missing information",
        description: "Please fill in at least the title and price.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          title: formData.title,
          description: formData.description || null,
          price: parseFloat(formData.price),
          image_url: formData.image_url || null,
          category: formData.category || null,
          condition: formData.condition || null,
          location: formData.location || null,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Product created!",
        description: "Your product has been successfully listed in the store.",
      });

      navigate('/store');
    } catch (error: any) {
      toast({
        title: "Error creating product",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex w-full">
        <AppSidebar />
        <SidebarInset>
          <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="text-xl font-semibold">Create Product</h1>
          </div>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Please Log In</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">You need to be logged in to create a product listing.</p>
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
          <h1 className="text-xl font-semibold">Create Product</h1>
        </div>
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Form Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    List Your Product
                  </CardTitle>
                  <CardDescription>
                    Create a listing for your handcrafted item in our marketplace.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Product Title *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Enter product title"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="flex items-center gap-2">
                        Description
                        {hasVideos && (
                          <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full">
                            {videoUrls.length} video{videoUrls.length > 1 ? 's' : ''} detected
                          </span>
                        )}
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Describe your product, materials used, crafting process... (YouTube, Vimeo, and Dailymotion links will be automatically embedded)"
                        rows={4}
                      />
                      {hasVideos && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Supported platforms: YouTube, Vimeo, Dailymotion
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Price (INR) *</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => handleInputChange('price', e.target.value)}
                          placeholder="0.00"
                          className="pl-8"
                          min="0"
                          step="0.01"
                          required
                        />
                      </div>
                    </div>

                    <ImageUpload
                      value={formData.image_url}
                      onChange={(url) => handleInputChange('image_url', url)}
                      label="Product Image"
                      placeholder="Upload product image or enter URL"
                      showPreview={true}
                      maxSize={5}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pottery">Pottery</SelectItem>
                            <SelectItem value="textiles">Textiles</SelectItem>
                            <SelectItem value="jewelry">Jewelry</SelectItem>
                            <SelectItem value="woodwork">Woodwork</SelectItem>
                            <SelectItem value="metalwork">Metalwork</SelectItem>
                            <SelectItem value="leather">Leather Goods</SelectItem>
                            <SelectItem value="art">Art & Paintings</SelectItem>
                            <SelectItem value="home-decor">Home Decor</SelectItem>
                            <SelectItem value="accessories">Accessories</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="condition">Condition</Label>
                        <Select value={formData.condition} onValueChange={(value) => handleInputChange('condition', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select condition" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="like-new">Like New</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="fair">Fair</SelectItem>
                            <SelectItem value="handmade">Handmade</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="City, State"
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/store')}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={loading} className="flex-1">
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 mr-2" />
                            Create Product
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Preview Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Preview</h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center space-x-2"
                  >
                    {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    <span>{showPreview ? 'Hide' : 'Show'} Preview</span>
                  </Button>
                </div>

                {showPreview && (
                  <Card>
                    <CardContent className="p-6">
                      {formData.title && (
                        <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-3">
                          {formData.title}
                        </h3>
                      )}
                      
                      {formData.price && (
                        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 mb-3">
                          ₹{parseFloat(formData.price).toFixed(2)}
                        </div>
                      )}

                      {formData.description && (
                        <div className="text-gray-600 dark:text-gray-300 mb-4">
                          <ContentWithVideos content={formData.description} />
                        </div>
                      )}

                      {formData.image_url && (
                        <div className="aspect-video overflow-hidden rounded-lg mb-4">
                          <img
                            src={formData.image_url}
                            alt="Product preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {(formData.category || formData.condition || formData.location) && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {formData.category && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs rounded-full">
                              {formData.category}
                            </span>
                          )}
                          {formData.condition && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs rounded-full">
                              {formData.condition}
                            </span>
                          )}
                          {formData.location && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 text-xs rounded-full">
                              📍 {formData.location}
                            </span>
                          )}
                        </div>
                      )}

                      {!formData.title && !formData.description && !formData.image_url && (
                        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                          <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p>Start filling in the form to see a preview of your product</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </div>
  );
};

export default CreateProduct;
