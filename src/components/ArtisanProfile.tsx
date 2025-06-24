
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Award, Clock, Users } from "lucide-react";

interface ArtisanProfileProps {
  artisan: {
    name: string;
    location: string;
    craft: string;
    story: string;
    image: string;
    experience: string;
    impact: string;
  };
}

const ArtisanProfile = ({ artisan }: ArtisanProfileProps) => {
  return (
    <Card className="sticky top-8 border-0 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <div className="relative inline-block">
            <img
              src={artisan.image}
              alt={artisan.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-orange-200 shadow-lg"
            />
            <div className="absolute -bottom-2 -right-2 bg-orange-500 rounded-full p-2">
              <Award className="w-4 h-4 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-1">{artisan.name}</h3>
          <div className="flex items-center justify-center text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="text-sm">{artisan.location}</span>
          </div>
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            {artisan.craft}
          </Badge>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Artisan Story</h4>
            <p className="text-gray-600 text-sm leading-relaxed">{artisan.story}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-amber-50 rounded-lg">
              <Clock className="w-5 h-5 text-amber-600 mx-auto mb-1" />
              <div className="text-sm font-semibold text-gray-900">{artisan.experience}</div>
              <div className="text-xs text-gray-600">Experience</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Users className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <div className="text-sm font-semibold text-gray-900">{artisan.impact}</div>
              <div className="text-xs text-gray-600">Impact</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ArtisanProfile;
