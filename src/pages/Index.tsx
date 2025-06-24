
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import PostsFeed from "@/components/PostsFeed";
import { useAuth } from "@/hooks/useAuth";
import { PlusCircle, LogIn } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {user && <AppSidebar />}
      
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              {user && <SidebarTrigger />}
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Stories Behind Every Thread
                </h1>
                <p className="text-gray-600">
                  Discover the artisans, traditions, and impact woven into every handcrafted piece
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {user ? (
                <Button
                  onClick={() => navigate('/create-post')}
                  className="bg-orange-600 hover:bg-orange-700 text-white transition-all duration-300 hover:scale-105"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Create Post
                </Button>
              ) : (
                <Button
                  onClick={() => navigate('/auth')}
                  className="bg-orange-600 hover:bg-orange-700 text-white transition-all duration-300 hover:scale-105"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {!user && (
              <div className="text-center mb-12 animate-fade-in">
                <div className="relative overflow-hidden bg-gradient-to-r from-amber-100 to-orange-100 py-16 rounded-2xl mb-8">
                  <div className="relative z-10">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                      Welcome to
                      <span className="text-orange-600 block">Artisan Stories</span>
                    </h1>
                    <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-8">
                      Join our community to share your craft stories and discover amazing artisan work
                    </p>
                    <Button
                      onClick={() => navigate('/auth')}
                      size="lg"
                      className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
                    >
                      Join Our Community
                    </Button>
                  </div>
                  <div className="absolute inset-0 opacity-30">
                    <div className="w-full h-full" style={{
                      backgroundImage: `url("data:image/svg+xml,${encodeURIComponent('<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="#f97316" fill-opacity="0.1"><circle cx="30" cy="30" r="2"/></g></g></svg>')}")`
                    }}></div>
                  </div>
                </div>
              </div>
            )}

            <PostsFeed />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
