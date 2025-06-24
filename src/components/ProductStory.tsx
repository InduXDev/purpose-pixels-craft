
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Clock, Leaf, Heart, ShoppingCart } from "lucide-react";

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
  };
  onClose: () => void;
}

const ProductStory = ({ product, onClose }: ProductStoryProps) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 border-0">
        <div className="grid md:grid-cols-2 h-full">
          {/* Image Section */}
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
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
          <div className="p-8 flex flex-col justify-between">
            <div>
              <DialogHeader className="mb-6">
                <DialogTitle className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </DialogTitle>
                <div className="text-3xl font-bold text-orange-600">{product.price}</div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Story Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Heart className="w-5 h-5 text-red-500 mr-2" />
                    The Story Behind
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{product.story}</p>
                </div>

                {/* Materials & Time */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="p-4 bg-amber-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Clock className="w-4 h-4 text-amber-600 mr-2" />
                      <span className="font-semibold text-gray-900">Crafting Time</span>
                    </div>
                    <p className="text-sm text-gray-600">{product.timeToMake}</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <Leaf className="w-4 h-4 text-green-600 mr-2" />
                      <span className="font-semibold text-gray-900">Materials</span>
                    </div>
                    <p className="text-sm text-gray-600">{product.materials}</p>
                  </div>
                </div>

                {/* Impact Tags */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Social & Environmental Impact</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.impact.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="bg-green-100 text-green-800">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              <Button size="lg" className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-full transition-all duration-300 hover:scale-105">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>
              <Button variant="outline" size="lg" className="w-full border-orange-600 text-orange-600 hover:bg-orange-50 py-3 rounded-full">
                <Heart className="w-5 h-5 mr-2" />
                Save to Wishlist
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductStory;
