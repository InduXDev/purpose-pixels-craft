import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Heart, 
  Palette, 
  Code, 
  Database, 
  Globe, 
  Award, 
  Sparkles,
  Github,
  Linkedin,
  Mail
} from 'lucide-react';

const About = () => {
  const teamMembers = [
    {
      name: "Ameena Khatoon",
      role: "Frontend Development & UI/UX",
      description: "Specialized in creating beautiful, responsive user interfaces and ensuring exceptional user experience across all devices.",
      skills: ["React", "TypeScript", "UI/UX Design", "Tailwind CSS"],
      avatar: "👩‍💻"
    },
    {
      name: "M. Indu Reddy",
      role: "Backend Development & Database Design",
      description: "Expert in database architecture, API development, and ensuring robust backend infrastructure for seamless data management.",
      skills: ["Supabase", "PostgreSQL", "API Design", "Database Security"],
      avatar: "👨‍💻"
    },
    {
      name: "P. Samhitha",
      role: "Full-stack Development & Features",
      description: "Versatile developer focused on implementing core features and ensuring smooth integration between frontend and backend systems.",
      skills: ["Full-stack", "React", "Node.js", "Feature Development"],
      avatar: "👩‍💻"
    },
    {
      name: "Masraddh",
      role: "Project Management & Testing",
      description: "Oversees project coordination, quality assurance, and ensures the delivery of a polished, bug-free application.",
      skills: ["Project Management", "Testing", "Quality Assurance", "Coordination"],
      avatar: "👨‍💼"
    }
  ];

  const features = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Community First",
      description: "Built for artisans to connect, share, and grow together"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Beautiful Design",
      description: "Modern, accessible interface that works on all devices"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Modern Tech",
      description: "Built with React, TypeScript, and cutting-edge technologies"
    },
    {
      icon: <Database className="w-6 h-6" />,
      title: "Secure & Scalable",
      description: "Robust backend with Supabase and enterprise-grade security"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Reach",
      description: "Multi-language support and worldwide accessibility"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Innovation",
      description: "Continuous improvement and feature enhancements"
    }
  ];

  const techStack = [
    { category: "Frontend", items: ["React 18", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui"] },
    { category: "Backend", items: ["Supabase", "PostgreSQL", "Row Level Security", "Real-time Subscriptions"] },
    { category: "Tools", items: ["ESLint", "Prettier", "Git", "Vercel/Netlify"] }
  ];

  return (
    <div className="flex w-full">
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">About</h1>
        </div>
        
        <div className="p-6">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Hero Section */}
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center text-3xl">
                    🎨
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    AIMS
                  </div>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                Purpose Pixels Craft
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                A modern platform for artisans to share their craft stories, showcase handmade products, 
                and connect with a community of creators. Built with passion by Team AIMS.
              </p>
            </div>

            {/* Mission Statement */}
            <Card className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-gray-800 dark:to-gray-700 border-orange-200 dark:border-gray-600">
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Our Mission</h2>
                  <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    To empower artisans worldwide by providing them with a beautiful, secure, and user-friendly platform 
                    where they can share their stories, showcase their craftsmanship, and build meaningful connections 
                    with customers and fellow creators. We believe every handmade piece has a story worth telling.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Team Section */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Meet Team AIMS</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  The talented developers behind Purpose Pixels Craft
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teamMembers.map((member, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="flex items-center space-x-4">
                        <div className="text-4xl">{member.avatar}</div>
                        <div>
                          <CardTitle className="text-gray-900 dark:text-gray-100">{member.name}</CardTitle>
                          <CardDescription className="text-orange-600 dark:text-orange-400 font-medium">
                            {member.role}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-600 dark:text-gray-300">
                        {member.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {member.skills.map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="secondary" className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Features Section */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">What Makes Us Special</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Key features that set Purpose Pixels Craft apart
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-6">
                      <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center text-orange-600 dark:text-orange-400">
                          {feature.icon}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Tech Stack */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Technology Stack</h2>
                <p className="text-gray-600 dark:text-gray-300">
                  Modern technologies powering our platform
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {techStack.map((stack, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-gray-900 dark:text-gray-100">{stack.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {stack.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-gray-600 dark:text-gray-300">{item}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Contact Section */}
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border-blue-200 dark:border-gray-600">
              <CardContent className="p-8">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Get in Touch</h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Have questions or want to collaborate? We'd love to hear from you!
                  </p>
                  <div className="flex justify-center space-x-4">
                    <a href="mailto:team@aims.com" className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                      <Mail className="w-5 h-5" />
                      <span>Email</span>
                    </a>
                    <a href="#" className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                      <Github className="w-5 h-5" />
                      <span>GitHub</span>
                    </a>
                    <a href="#" className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
                      <Linkedin className="w-5 h-5" />
                      <span>LinkedIn</span>
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer */}
            <div className="text-center py-8 border-t border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-300">
                © 2024 Purpose Pixels Craft. Built with ❤️ by Team AIMS.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Empowering artisans, one story at a time.
              </p>
            </div>
          </div>
        </div>
      </SidebarInset>
    </div>
  );
};

export default About; 