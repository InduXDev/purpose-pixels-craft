
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Users, Award, Globe } from "lucide-react";

const ImpactMetrics = () => {
  const metrics = [
    {
      icon: Users,
      value: "12",
      label: "Families Supported",
      color: "text-blue-600"
    },
    {
      icon: Leaf,
      value: "100%",
      label: "Natural Materials",
      color: "text-green-600"
    },
    {
      icon: Award,
      value: "5",
      label: "Generations of Craft",
      color: "text-purple-600"
    },
    {
      icon: Globe,
      value: "Zero",
      label: "Carbon Footprint",
      color: "text-orange-600"
    }
  ];

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-blue-50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-gray-900 text-center">
          Community Impact
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-white shadow-sm ${metric.color}`}>
              <metric.icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-gray-900">{metric.value}</div>
              <div className="text-sm text-gray-600">{metric.label}</div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ImpactMetrics;
