
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Clock, Award } from "lucide-react";
import ArtisanProfile from "@/components/ArtisanProfile";
import ProductStory from "@/components/ProductStory";
import ImpactMetrics from "@/components/ImpactMetrics";

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const artisan = {
    name: "Elena Rodriguez",
    location: "Oaxaca, Mexico",
    craft: "Traditional Textile Weaving",
    story: "Elena learned the ancient art of backstrap loom weaving from her grandmother. Each piece takes weeks to complete using traditional techniques passed down through five generations.",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=400&fit=crop&crop=faces",
    experience: "15 years",
    impact: "Supports 12 local families"
  };

  const products = [
    {
      id: 1,
      name: "Zapotec Sunrise Shawl",
      price: "$185",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=500&h=500&fit=crop",
      story: "Inspired by the colors of dawn over the Sierra Madre mountains, this shawl is woven with naturally dyed wool using cochineal insects for the deep reds and indigo for the blues.",
      impact: ["Supports 3 sheep farmers", "Uses natural dyes only", "Zero waste production"],
      timeToMake: "3 weeks",
      materials: "100% organic wool, natural plant dyes"
    },
    {
      id: 2,
      name: "Mountain Mist Table Runner",
      price: "$145",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=500&fit=crop",
      story: "The intricate geometric patterns represent the morning mist rolling over ancient Zapotec ruins. Each diamond symbolizes a mountain peak in Elena's homeland.",
      impact: ["Preserves ancient techniques", "Fair trade certified", "Eco-friendly packaging"],
      timeToMake: "2 weeks",
      materials: "Hand-spun cotton, vegetable dyes"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-100 to-orange-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Stories Behind
              <span className="text-orange-600 block">Every Thread</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
              Discover the artisans, traditions, and impact woven into every handcrafted piece
            </p>
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full transition-all duration-300 hover:scale-105">
              Explore Stories
            </Button>
          </div>
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23f97316\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Artisan Profile */}
          <div className="lg:col-span-1">
            <ArtisanProfile artisan={artisan} />
            <div className="mt-8">
              <ImpactMetrics />
            </div>
          </div>

          {/* Products Section */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Handcrafted Collections</h2>
              <p className="text-gray-600">Each piece tells a story of tradition, craftsmanship, and community impact</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {products.map((product) => (
                <Card 
                  key={product.id} 
                  className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 shadow-lg bg-white/80 backdrop-blur-sm"
                  onClick={() => setSelectedProduct(product)}
                >
                  <div className="aspect-square overflow-hidden rounded-t-lg">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-600 transition-colors">
                        {product.name}
                      </h3>
                      <Button variant="ghost" size="sm" className="p-1 hover:bg-orange-100">
                        <Heart className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
                      </Button>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {product.story}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.impact.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {product.timeToMake}
                      </div>
                      <div className="text-2xl font-bold text-orange-600">
                        {product.price}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Product Story Modal */}
      {selectedProduct && (
        <ProductStory 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </div>
  );
};

export default Index;
